import type {
  CustomNodeInfo,
  Services,
  VisualBlocksImage,
  VisualBlocksDetectedObject,
} from "@visualblocks/custom-node-types";

import type {
  ObjectDetectionPipelineSingle,
  ObjectDetectionPipeline,
} from "@xenova/transformers";

import {
  PipelineSingleton,
  BasePipelineNode,
} from "../../backends/client/base";

import { NODE_SPEC } from "../specs/object-detection-spec";

declare interface Inputs {
  image: VisualBlocksImage;
}

class ObjectDetectionPipelineSingleton extends PipelineSingleton {
  static task = "object-detection";
  static modelId = "Xenova/detr-resnet-50";
  static quantized = true;
}

class ObjectDetectionNode extends BasePipelineNode {
  private cachedInput: string | null = null;
  private cachedResult: VisualBlocksDetectedObject[] | null = null;

  constructor() {
    super(ObjectDetectionPipelineSingleton);
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

    if (this.cachedResult && this.cachedInput === image.canvasId) {
      this.dispatchEvent(
        new CustomEvent("outputs", {
          detail: { results: { results: this.cachedResult } },
        })
      );
      return;
    }
    const canvas = services.resourceService.get(
      image.canvasId
    ) as HTMLCanvasElement;
    const data = canvas.toDataURL();

    const detector: ObjectDetectionPipeline = await this.instance;

    // Predict segments
    const result = await detector(data, {
      // TODO: Add option for threshold
      // threshold: 0.5,
      percentage: true,
    });

    const resultArray = (
      Array.isArray(result) ? result : [result]
    ) as ObjectDetectionPipelineSingle[];

    const outputVB: VisualBlocksDetectedObject[] = resultArray.map((x) => {
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
    this.cachedResult = outputVB;
    this.cachedInput = image.canvasId;

    this.dispatchEvent(
      new CustomEvent("outputs", { detail: { results: { results: outputVB } } })
    );
  }
}

export default {
  nodeSpec: NODE_SPEC,
  nodeImpl: ObjectDetectionNode,
} as CustomNodeInfo;
