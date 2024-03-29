import type {
  CustomNodeInfo,
  Services,
  VisualBlocksImage,
} from "@visualblocks/custom-node-types";

import type { ImageSegmentationPipelineOutput } from "@xenova/transformers";

import { html, LitElement } from "lit";
import { property } from "lit/decorators.js";
import { clamp } from "../../utils";
import { NODE_SPEC } from "./image-segmentation-viewer-spec";
import { COLORS } from "../../constants";

const IMAGE_SEGMENTATION_NODE_STYLE = `
.container {
    position: relative;
}

.container {
    width: 100%;
    height: auto;
}

canvas {
    width: 100%;
    height: auto;
}
`;

declare interface Inputs {
  segData: ImageSegmentationPipelineOutput[];
  image: VisualBlocksImage;
}

class ImageSegmentationViewerNode extends LitElement {
  private cachedSegData: ImageSegmentationPipelineOutput[] | null = null;
  private cachedOutputImage: HTMLCanvasElement | null = null;
  private cachedInputImage: string | null = null;

  canvas: HTMLCanvasElement | null = null;

  @property()
  masks: HTMLCanvasElement[] = [];
  @property()
  inputImage!: HTMLCanvasElement;
  @property()
  selectedPoints: { x: number; y: number }[] = [];

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
        @pointermove=${this.onPointerMove}
        @pointerleave=${this.onPointerLeave}
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
    if (!this.inputImage) return;
    const canvasEl = this.canvas as HTMLCanvasElement;
    if (this.masks.length === 0) return;

    // Get bounding box
    const bb = canvasEl.getBoundingClientRect();
    // Get the mouse coordinates relative to the container
    let px = (event.clientX - bb.left - canvasEl.clientLeft) / bb.width;
    let py = (event.clientY - bb.top - canvasEl.clientTop) / bb.height;
    // Clamp the coordinates to the image
    px = clamp(px);
    py = clamp(py);
    this.selectedPoints.push({ x: px, y: py });
    if (event.metaKey) {
      this.selectedPoints = [];
    }
    const canvas = this.cutImage(this.selectedPoints);

    const outputImage = {
      canvasId: this.services.resourceService.put(canvas),
    };
    this.cachedOutputImage = canvas;
    this.dispatchEvent(
      new CustomEvent("outputs", {
        detail: { image: outputImage },
      })
    );
  }

  cutImage(points: { x: number; y: number }[]) {
    const canvas = document.createElement("canvas");
    canvas.width = this.inputImage.width;
    canvas.height = this.inputImage.height;
    const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;

    ctx.save();
    ctx.drawImage(this.inputImage, 0, 0);

    const tempCanvas = document.createElement("canvas");
    const tempCtx = tempCanvas.getContext("2d") as CanvasRenderingContext2D;
    tempCanvas.width = this.inputImage.width;
    tempCanvas.height = this.inputImage.height;
    // Loop over all canvases
    for (const { x: px, y: py } of points) {
      for (const mask of this.masks) {
        const canvasX = mask.width * px;
        const canvasY = mask.height * py;
        // Get the pixel data of the mouse coordinates
        const maskctx = mask.getContext("2d") as CanvasRenderingContext2D;
        const pixelData = maskctx.getImageData(canvasX, canvasY, 1, 1).data;

        // Apply hover effect if not fully opaque
        if (pixelData[3] === 255) {
          tempCtx.drawImage(mask, 0, 0);
          break;
        }
      }
    }
    ctx.globalCompositeOperation = "destination-in";
    ctx.drawImage(tempCanvas, 0, 0);
    ctx.restore();
    return canvas;
  }

  onPointerMove(event: PointerEvent) {
    const canvasEl = this.canvas as HTMLCanvasElement;
    if (this.masks.length === 0) return;
    // Get bounding box
    const bb = canvasEl.getBoundingClientRect();
    // Get the mouse coordinates relative to the container
    let px = (event.clientX - bb.left - canvasEl.clientLeft) / bb.width;
    let py = (event.clientY - bb.top - canvasEl.clientTop) / bb.height;
    // Clamp the coordinates to the image
    px = clamp(px);
    py = clamp(py);

    const ctx = canvasEl.getContext("2d") as CanvasRenderingContext2D;
    ctx.save();
    ctx.clearRect(0, 0, canvasEl.width, canvasEl.height);

    if (this.inputImage) {
      ctx.drawImage(this.inputImage, 0, 0);
    }
    // Loop over all canvases
    for (const mask of this.masks) {
      const canvasX = mask.width * px;
      const canvasY = mask.height * py;
      // Get the pixel data of the mouse coordinates
      const maskctx = mask.getContext("2d") as CanvasRenderingContext2D;
      const pixelData = maskctx.getImageData(canvasX, canvasY, 1, 1).data;

      // Apply hover effect if not fully opaque
      if (pixelData[3] < 255) {
        ctx.globalAlpha = 0.1;
        ctx.drawImage(mask, 0, 0);
      } else {
        ctx.globalAlpha = 0.6;
        ctx.drawImage(mask, 0, 0);
        // TODO: Show label
        // status.textContent = canvas.getAttribute('data-label');
      }
    }
    ctx.restore();
  }
  onPointerLeave(event: PointerEvent) {
    const canvasEl = this.canvas as HTMLCanvasElement;
    const ctx = canvasEl.getContext("2d") as CanvasRenderingContext2D;
    ctx.save();
    const mask0 = this.masks[0];
    canvasEl.width = mask0.width;
    canvasEl.height = mask0.height;
    ctx.clearRect(0, 0, canvasEl.width, canvasEl.height);
    if (this.inputImage) {
      ctx.drawImage(this.inputImage, 0, 0);
    }
    ctx.globalAlpha = 0.6;
    this.masks.forEach((mask) => ctx.drawImage(mask, 0, 0));
    ctx.restore();
  }

  // Render a mask on the image
  renderMask(
    { mask, label, score }: ImageSegmentationPipelineOutput,
    i: number
  ) {
    // Create new canvas
    const canvas = document.createElement("canvas");
    canvas.width = mask.width;
    canvas.height = mask.height;
    canvas.setAttribute("data-label", label);

    // Create context and allocate buffer for pixel data
    const context = canvas.getContext("2d") as CanvasRenderingContext2D;
    const imageData = context.createImageData(canvas.width, canvas.height);
    const pixelData = imageData.data;

    // Choose colour based on index
    const [r, g, b] = COLORS[i % COLORS.length];

    // Fill mask with colour
    for (let i = 0; i < pixelData.length; ++i) {
      if (mask.data[i] !== 0) {
        const offset = 4 * i;
        pixelData[offset] = r; // red
        pixelData[offset + 1] = g; // green
        pixelData[offset + 2] = b; // blue
        pixelData[offset + 3] = 255; // alpha (fully opaque)
      }
    }

    // Draw image data to context
    context.putImageData(imageData, 0, 0);

    return canvas;
  }

  async runWithInputs(inputs: Inputs, services: Services) {
    const { segData, image } = inputs;

    this.services = services;
    if (segData === undefined || segData?.length === 0) {
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
      return;
    }
    if (
      this.cachedSegData &&
      this.cachedOutputImage &&
      this.cachedInputImage === image.canvasId
    ) {
      let outputImage = image;
      if (this.cachedOutputImage) {
        outputImage = {
          canvasId: this.services.resourceService.put(this.cachedOutputImage),
        };
      }

      this.dispatchEvent(
        new CustomEvent("outputs", {
          detail: {
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
    }
    this.canvas = document.createElement("canvas");
    this.masks = segData.map((x, i) => this.renderMask(x, i));
    const ctx = this.canvas.getContext("2d") as CanvasRenderingContext2D;
    ctx.save();
    const mask0 = this.masks[0];
    this.canvas.width = mask0.width;
    this.canvas.height = mask0.height;
    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    if (this.inputImage) {
      ctx.drawImage(this.inputImage, 0, 0);
    }
    ctx.globalAlpha = 0.6;
    this.masks.forEach((mask) => ctx.drawImage(mask, 0, 0));
    ctx.restore();

    this.cachedSegData = segData;
    this.cachedInputImage = image?.canvasId;

    this.dispatchEvent(
      new CustomEvent("outputs", {
        detail: { image: image },
      })
    );
  }
}

export default {
  nodeSpec: NODE_SPEC,
  nodeImpl: ImageSegmentationViewerNode,
} as CustomNodeInfo;
