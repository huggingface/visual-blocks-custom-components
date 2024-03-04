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
  image: VisualBlocksImage;
}

class ImageSegmentationNode extends BasePipelineNode {
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

    // Clear masks
    // this.masks.innerHTML = '';

    const canvas = services.resourceService.get(
      image.canvasId
    ) as HTMLCanvasElement;
    const data = canvas.toDataURL();
    const segmenter = (await this.instance) as ImageSegmentationPipeline;

    // Predict segments
    const output = await segmenter(data);

    const detail: Outputs = { segData: output, image: image };
    this.dispatchEvent(new CustomEvent("outputs", { detail: detail }));
  }
}

export default {
  nodeSpec: NODE_SPEC,
  nodeImpl: ImageSegmentationNode,
} as CustomNodeInfo;
