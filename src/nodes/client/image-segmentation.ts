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
// import { compareObjects } from "../../utils";

import { NODE_SPEC } from "./image-segmentation-spec";
import { compareObjects } from "../../utils";

class ImageSegmentationPipelineSingleton extends PipelineSingleton {
  static task = "image-segmentation";
  static modelId = "Xenova/segformer_b0_clothes";
  static quantized = false;
}

declare interface Inputs {
  image: VisualBlocksImage;
  quantized: boolean;
  modelid_curated: string;
  modelid: string;
}
declare interface Outputs {
  segData: ImageSegmentationPipelineOutput[];
}

class ImageSegmentationNode extends BasePipelineNode {
  private cachedInput?: Inputs;
  private cachedResult?: ImageSegmentationPipelineOutput[];

  constructor() {
    super(ImageSegmentationPipelineSingleton);
  }
  render() {}

  async runWithInputs(inputs: Inputs, services: Services) {
    const { image, modelid, modelid_curated, quantized } = inputs;

    const _modelid = (modelid || modelid_curated)?.trim();
    if (!image?.canvasId) {
      // No input node
      this.dispatchEvent(
        new CustomEvent("outputs", { detail: { segData: null } })
      );
      return;
    }

    if (this.cachedResult && compareObjects(this.cachedInput, inputs)) {
      this.dispatchEvent(
        new CustomEvent("outputs", { detail: { segData: this.cachedResult } })
      );
      return;
    }
    this.cachedInput = inputs;

    // Clear masks
    // this.masks.innerHTML = '';

    const canvas = services.resourceService.get(
      image.canvasId
    ) as HTMLCanvasElement;
    const data = canvas.toDataURL();
    const segmenter: ImageSegmentationPipeline = await this.getInstance(
      _modelid,
      quantized
    );

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
