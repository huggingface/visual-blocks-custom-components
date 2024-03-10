import type {
  CustomNodeInfo,
  Services,
  VisualBlocksImage,
} from "@visualblocks/custom-node-types";

import type { DepthEstimationPipelineOutput } from "@xenova/transformers";

import { html, LitElement } from "lit";
import { property } from "lit/decorators.js";
import { NODE_SPEC } from "./depth-estimation-viewer-spec";

import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

const IMAGE_SEGMENTATION_NODE_STYLE = `
.container {
    position: relative;
}

.container {
    width: 100%;
    height: 100%;
}

canvas {
    width: 100%;
    height: auto;
}
`;

declare interface Inputs {
  depthData: DepthEstimationPipelineOutput[];
  image: VisualBlocksImage;
  displacement: number;
}

class DepthEstimationViewerNode extends LitElement {
  private cachedDepthData: DepthEstimationPipelineOutput[] | null = null;
  private cachedOutputImage: HTMLCanvasElement | null = null;
  private cachedInputImage: string | null = null;
  private cachedDisplacement: number | null = null;

  canvas: HTMLCanvasElement | null = null;

  @property()
  inputImage!: HTMLCanvasElement;

  @property()
  plane!: THREE.Mesh;

  @property()
  material: THREE.MeshStandardMaterial | null = null;

  @property()
  services!: Services;

  constructor() {
    super();
  }

  render() {
    if (!this.canvas) {
      return html`<div class="container"></div>`;
    }
    return html`<div class="container">
      <div
        title=${NODE_SPEC.description}
        @pointerdown=${this.onPointerDown}
      >
        ${this.canvas}
      </div>
      <style>
        ${IMAGE_SEGMENTATION_NODE_STYLE}
      </style>
    </div>`;
  }
  onPointerDown(event: PointerEvent) {
    event.preventDefault();
  }

  connectedCallback(): void {
    super.connectedCallback();

    this.canvas = document.createElement("canvas");

    // Create new scene
    const width = this.canvas.width = this.offsetWidth;
    const height = this.canvas.height = this.offsetHeight;

    const scene = new THREE.Scene();

    // Create camera and add it to the scene
    const camera = new THREE.PerspectiveCamera(30, width / height, 0.01, 10);
    camera.position.z = 2;
    scene.add(camera);

    const renderer = new THREE.WebGLRenderer({ canvas: this.canvas, antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(window.devicePixelRatio);

    // Add ambient light
    const light = new THREE.AmbientLight(0xffffff, 2);
    scene.add(light);

    this.plane = new THREE.Mesh();
    scene.add(this.plane);

    // Add orbit controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;

    let lastWidth = -1;
    let lastHeight = -1;
    renderer.setAnimationLoop(() => {
      // Resize renderer if the size of the container changed
      if (lastWidth !== this.offsetWidth || lastHeight !== this.offsetHeight) {
        lastWidth = this.offsetWidth;
        lastHeight = this.offsetHeight;
        renderer.setSize(this.offsetWidth, this.offsetHeight);
        camera.aspect = this.offsetWidth / this.offsetHeight;
        camera.updateProjectionMatrix();
      }

      renderer.render(scene, camera);
      controls.update();
    });
  }

  async runWithInputs(inputs: Inputs, services: Services) {
    const { depthData, image, displacement } = inputs;

    this.dispatchEvent(
      new CustomEvent("outputs", {
        detail: {
          error: {
            title: "Error",
            message: "No segments found",
          },
        },
      })
    );
    this.services = services;
    if (depthData === undefined || depthData?.length === 0) {
      this.dispatchEvent(
        new CustomEvent("outputs", {
          detail: {
            error: {
              title: "Error",
              message: "No segments found",
            },
          },
        })
      );
    }
    if (
      this.cachedDepthData &&
      this.cachedOutputImage &&
      this.cachedInputImage === image.canvasId
    ) {
      let outputImage = image;
      if (this.cachedOutputImage) {
        outputImage = {
          canvasId: this.services.resourceService.put(this.cachedOutputImage),
        };
      }
      if (this.material && this.cachedDisplacement !== displacement) {
        // Only update displacement 
        this.material.displacementScale = displacement;
        this.material.needsUpdate = true;
      }

      this.dispatchEvent(
        new CustomEvent("outputs", {
          detail: {
            depthData: this.cachedDepthData,
            image: outputImage,
          },
        })
      );
      return;
    }

    if (image?.canvasId !== undefined) {
      const imgCanvas = services.resourceService.get(
        image.canvasId
      ) as HTMLCanvasElement;
      this.inputImage = imgCanvas;
      this.cachedOutputImage = imgCanvas;

      // Create plane and rescale it so that max(w, h) = 1
      const [w, h] = [imgCanvas.width, imgCanvas.height]
      const [pw, ph] = w > h ? [1, h / w] : [w / h, 1];
      const geometry = new THREE.PlaneGeometry(pw, ph, w, h);

      const map = new THREE.CanvasTexture(this.inputImage);
      map.colorSpace = THREE.SRGBColorSpace;

      this.material = new THREE.MeshStandardMaterial({
        map,
        side: THREE.DoubleSide,
      });

      this.plane.geometry = geometry;
      this.plane.material = this.material;
      this.material.displacementScale = displacement;

      if (depthData?.[0]) {
        this.material.displacementMap = new THREE.CanvasTexture(depthData[0].depth.toCanvas());
      }
      this.material.needsUpdate = true;
    }

    this.cachedDepthData = depthData;
    this.cachedInputImage = image?.canvasId;

    this.dispatchEvent(
      new CustomEvent("outputs", {
        detail: { depthData: depthData, image: image },
      })
    );
  }
}

export default {
  nodeSpec: NODE_SPEC,
  nodeImpl: DepthEstimationViewerNode,
} as CustomNodeInfo;
