import type {
  CustomNodeInfo,
  Services,
  VisualBlocksImage,
} from "@visualblocks/custom-node-types";

import type {
  ImageSegmentationPipelineOutput,
  ImageSegmentationPipeline,
} from "@xenova/transformers";

import {
  PipelineSingleton,
  BasePipelineNode,
} from "../../backends/client/base";

import { NODE_SPEC } from "../specs/image-segmentation-spec";

class ImageSegmentationPipelineSingleton extends PipelineSingleton {
  static task = "image-segmentation";
  static modelId = "Xenova/face-parsing";
  static quantized = true;
}

declare interface Inputs {
  image: VisualBlocksImage;
}
declare interface Outputs {
  segData: ImageSegmentationPipelineOutput[];
}

class ImageSegmentationNode extends BasePipelineNode {
  private cachedInput: string | null = null;
  private cachedResult: ImageSegmentationPipelineOutput[] | null = null;

  constructor() {
    super(ImageSegmentationPipelineSingleton);
  }
  render() {}

  async runWithInputs(inputs: Inputs, services: Services) {
    const { image } = inputs;
    if (!image?.canvasId) {
      // No input node
      this.dispatchEvent(
        new CustomEvent("outputs", { detail: { result: null } })
      );
      return;
    }

    if (this.cachedResult && this.cachedInput === image.canvasId) {
      this.dispatchEvent(
        new CustomEvent("outputs", { detail: { segData: this.cachedResult } })
      );
      return;
    }
    this.cachedInput = image.canvasId;

    // Clear masks
    // this.masks.innerHTML = '';

    const canvas = services.resourceService.get(
      image.canvasId
    ) as HTMLCanvasElement;
    const data = canvas.toDataURL();
    const segmenter: ImageSegmentationPipeline = await this.instance;

    // Predict segments
    const output = await segmenter(data);
    this.cachedResult = output;

    const detail: Outputs = { segData: output };
    this.dispatchEvent(new CustomEvent("outputs", { detail: detail }));
  }
}

export default {
  nodeSpec: NODE_SPEC,
  nodeImpl: ImageSegmentationNode,
} as CustomNodeInfo;
