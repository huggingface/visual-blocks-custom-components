import type {
  CustomNodeInfo,
  Services,
  VisualBlocksImage,
} from "@visualblocks/custom-node-types";

import type {
  DepthEstimationPipeline,
  DepthEstimationPipelineOutput,
} from "@xenova/transformers";

import {
  PipelineSingleton,
  BasePipelineNode,
} from "../../backends/client/base";

import { NODE_SPEC } from "./depth-estimation-spec";
import { compareObjects } from "../../utils";

declare interface Inputs {
  image: VisualBlocksImage;
  modelid: string;
  modelid_curated: string;
  quantized: boolean;
}

declare interface Outputs {
  depthData: DepthEstimationPipelineOutput[];
}

class DepthEstimationPipelineSingleton extends PipelineSingleton {
  static task = "depth-estimation";
}

class DepthEstimationNode extends BasePipelineNode {
  private cachedInput?: Inputs;
  private cachedResult?: DepthEstimationPipelineOutput[];

  constructor() {
    super(DepthEstimationPipelineSingleton);
  }

  async runWithInputs(inputs: Inputs, services: Services) {
    const { image, modelid, modelid_curated, quantized } = inputs;

    const _modelid = (modelid || modelid_curated)?.trim();
    if (!image?.canvasId) {
      // No input node
      this.dispatchEvent(
        new CustomEvent("outputs", { detail: { depthData: null } })
      );
      return;
    }

    if (this.cachedResult && compareObjects(this.cachedInput, inputs)) {
      this.dispatchEvent(
        new CustomEvent("outputs", { detail: { depthData: this.cachedResult } })
      );
      return;
    }
    this.cachedInput = inputs;

    const canvas = services.resourceService.get(
      image.canvasId
    ) as HTMLCanvasElement;
    const data = canvas.toDataURL();

    const depth_estimator: DepthEstimationPipeline = await this.getInstance(
      _modelid,
      quantized
    );

    // Predict depth
    const result = await depth_estimator(data);

    const resultArray = (
      Array.isArray(result) ? result : [result]
    ) as DepthEstimationPipelineOutput[];

    this.cachedResult = resultArray;

    const detail: Outputs = { depthData: resultArray };

    this.cachedInput = inputs;

    this.dispatchEvent(new CustomEvent("outputs", { detail: detail }));
  }
}

export default {
  nodeSpec: NODE_SPEC,
  nodeImpl: DepthEstimationNode,
} as CustomNodeInfo;
