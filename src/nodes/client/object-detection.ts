import type {
  CustomNodeInfo,
  Services,
  VisualBlocksImage,
  VisualBlocksObjectDetectionResult,
} from "@visualblocks/custom-node-types";

import type {
  ObjectDetectionPipeline,
  ObjectDetectionPipelineOutput,
} from "@xenova/transformers";

import {
  PipelineSingleton,
  BasePipelineNode,
  DevicesType,
} from "../../backends/client/base";

import { NODE_SPEC } from "./object-detection-spec";
import { compareObjects } from "../../utils";

declare interface Inputs {
  image: VisualBlocksImage;
  modelid: string;
  modelid_curated: string;
  quantized: boolean;
  device: DevicesType;
}

class ObjectDetectionPipelineSingleton extends PipelineSingleton {
  static task = "object-detection";
}

class ObjectDetectionNode extends BasePipelineNode {
  private cachedInput?: Inputs;
  private cachedResult?: VisualBlocksObjectDetectionResult;
  constructor() {
    super(ObjectDetectionPipelineSingleton);
  }

  async runWithInputs(inputs: Inputs, services: Services) {
    const { image, modelid, modelid_curated, device, quantized } = inputs;

    const _modelid = (modelid || modelid_curated)?.trim();
    if (!image?.canvasId) {
      // No input node
      this.dispatchEvent(
        new CustomEvent("outputs", { detail: { results: null } })
      );
      return;
    }

    if (this.cachedResult && compareObjects(this.cachedInput, inputs)) {
      this.dispatchEvent(
        new CustomEvent("outputs", { detail: { results: this.cachedResult } })
      );
      return;
    }

    const canvas = services.resourceService.get(
      image.canvasId
    ) as HTMLCanvasElement;
    const data = canvas.toDataURL();

    const detector: ObjectDetectionPipeline = await this.getInstance(
      _modelid,
      quantized,
      device
    );

    // Predict segments
    const result = await detector(data, {
      // TODO: Add option for threshold
      // threshold: 0.5,
      percentage: true,
    });

    const resultArray = (
      Array.isArray(result) ? result : [result]
    ) as ObjectDetectionPipelineOutput;

    const outputVB = resultArray.map((x) => {
      return {
        label: x.label,
        score: x.score,
        box: {
          left: x.box.xmin,
          top: x.box.ymin,
          width: x.box.xmax - x.box.xmin,
          height: x.box.ymax - x.box.ymin,
        },
      };
    });
    this.cachedInput = inputs;
    this.cachedResult = { results: outputVB };

    this.dispatchEvent(
      new CustomEvent("outputs", { detail: { results: this.cachedResult } })
    );
  }
}

export default {
  nodeSpec: NODE_SPEC,
  nodeImpl: ObjectDetectionNode,
} as CustomNodeInfo;
