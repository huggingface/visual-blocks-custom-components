import type {
  CustomNodeInfo,
  NodeSpec,
  Services,
  VisualBlocksImage,
} from "@visualblocks/custom-node-types";
import {
  DataType,
  Category,
  EditorType,
} from "@visualblocks/custom-node-types";
import type {
  ImageSegmentationPipelineOutput,
  ImageSegmentationPipeline,
} from "@xenova/transformers";

import { PipelineSingleton, BasePipelineNode } from "./base";
import { html } from "lit";
import { property } from "lit/decorators.js";
import { createRef, ref, type Ref } from "lit/directives/ref.js";

import { COLLECTION_NAME } from "../constants";

import { clamp } from "../utils";

const NODE_SPEC: NodeSpec = {
  id: "transformers-image-segmentation",
  name: "Image segmentation",
  description: "TODO",

  category: Category.PROCESSOR,
  collection: COLLECTION_NAME,

  // Properties.
  propertySpecs: [],

  // Inputs.
  inputSpecs: [
    {
      name: "image",
      type: DataType.IMAGE,
    },
  ],

  // Outputs.
  outputSpecs: [
    {
      name: "result",
      type: DataType.STRING,
    },
    {
      name: "image",
      type: DataType.IMAGE,
    },
  ],
};

class ImageSegmentationPipelineSingleton extends PipelineSingleton {
  static task = "image-segmentation";
  static modelId = "Xenova/face-parsing";
  static quantized = true;
}

const IMAGE_SEGMENTATION_NODE_STYLE = `
.container {
    position: relative;
}

.container, .image, .masks {
    width: 100%;
    height: auto;
}

.image, .masks {
    position: absolute;
}

.image {
    z-index: 1;
}

.masks {
    z-index: 2;
}

canvas {
    position: absolute;
    width: 100%;
    height: auto;
    opacity: 0.6;
}
`;

declare interface Inputs {
  image: VisualBlocksImage;
}
declare interface Outputs {
  result: ImageSegmentationPipelineOutput;
  image: VisualBlocksImage;
}

// Mapping of label to colour
const colours = [
  [234, 76, 76], // red
  [28, 180, 129], // sea green
  [234, 155, 21], // orange
  [67, 132, 243], // blue
  [243, 117, 36], // orange-red
  [145, 98, 243], // purple
  [21, 178, 208], // cyan
  [132, 197, 33], // lime
];

class ImageSegmentationNode extends BasePipelineNode {
  @property()
  masks: HTMLCanvasElement[] = [];
  @property()
  image: HTMLCanvasElement | null = null;

  masksRef: Ref<HTMLInputElement> = createRef();

  constructor() {
    super(ImageSegmentationPipelineSingleton);
  }
  render() {
    return html`<div class="container">
      <style>${IMAGE_SEGMENTATION_NODE_STYLE}</style>
      </style>
      <div class="masks"
        ${ref(this.masksRef)}
        @pointermove=${this.onPointerMove} 
        @pointerleave=${this.onPointerLeave}>
      ${this.masks}
      </div>
      <div class="image">${this.image}</div>
    </div>`;
  }

  onPointerMove(event: PointerEvent) {
    if (this.masks.length === 0 || !this.masksRef.value) return;

    // Get bounding box
    const bb = this.masksRef.value.getBoundingClientRect();

    // Get the mouse coordinates relative to the container
    const mouseX = clamp(event.layerX / bb.width);
    const mouseY = clamp(event.layerY / bb.height);

    // Loop over all canvases
    for (const canvas of this.masks) {
      const canvasX = canvas.width * mouseX;
      const canvasY = canvas.height * mouseY;

      // Get the pixel data of the mouse coordinates
      const context = canvas.getContext("2d") as CanvasRenderingContext2D;
      const pixelData = context.getImageData(canvasX, canvasY, 1, 1).data;

      // Apply hover effect if not fully opaque
      if (pixelData[3] < 255) {
        canvas.style.opacity = "0.1";
      } else {
        canvas.style.opacity = "0.8";
        // TODO: Show label
        // status.textContent = canvas.getAttribute('data-label');
      }
    }
  }
  onPointerLeave(event: PointerEvent) {
    const canvases = this.masks;
    if (canvases.length > 0) {
      canvases.forEach(
        (canvas: HTMLCanvasElement) => (canvas.style.opacity = "0.6")
      );
      // TODO: Clear label
      // status.textContent = '';
    }
  }

  // Render a mask on the image
  renderMask(
    { mask, label, score }: ImageSegmentationPipelineOutput,
    i: number
  ) {
    // Create new canvas
    const canvas = document.createElement("canvas") as HTMLCanvasElement;
    canvas.width = mask.width;
    canvas.height = mask.height;

    canvas.setAttribute("data-label", label);

    // Create context and allocate buffer for pixel data
    const context = canvas.getContext("2d") as CanvasRenderingContext2D;
    const imageData = context.createImageData(canvas.width, canvas.height);
    const pixelData = imageData.data;

    // Choose colour based on index
    const [r, g, b] = colours[i % colours.length];

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

    // Append canvas to masks container
    return canvas;
  }

  async runWithInputs(inputs: Inputs, services: Services) {
    const { image } = inputs;
    if (!image?.canvasId) {
      // No input node
      this.dispatchEvent(
        new CustomEvent("outputs", { detail: { result: null } })
      );
      return;
    }

    // Clear masks
    // this.masks.innerHTML = '';

    const canvas = services.resourceService.get(
      image.canvasId
    ) as HTMLCanvasElement;
    this.image = canvas;
    const data = canvas.toDataURL();

    const segmenter = (await this.instance) as ImageSegmentationPipeline;

    // Predict segments
    const output = await segmenter(data);

    this.masks = output.map((x, i) => this.renderMask(x, i));
    // // Render masks
    // output.forEach((x, i) => this.renderMask(x, i));

    // // TODO improve output
    // const result = { done: true }

    this.dispatchEvent(
      new CustomEvent("outputs", { detail: { result: output, image: image } })
    );
  }
}

export default {
  nodeSpec: NODE_SPEC,
  nodeImpl: ImageSegmentationNode,
} as CustomNodeInfo;
