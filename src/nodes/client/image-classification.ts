import type {
  ImageClassificationPipeline,
  ImageClassificationOutput,
} from "@xenova/transformers";
import type {
  CustomNodeInfo,
  Services,
  VisualBlocksImage,
  VisualBlocksClassificationResult,
} from "@visualblocks/custom-node-types";
import { NODE_SPEC } from "./image-classification-specs";
import {
  PipelineSingleton,
  BasePipelineNode,
  DevicesType,
} from "../../backends/client/base";
import { compareObjects } from "../../utils";

declare interface Inputs {
  image: VisualBlocksImage;
  modelid: string;
  quantized: boolean;
  device: DevicesType;
}

class ImageClassificationPipelineSingleton extends PipelineSingleton {
  static task = "image-classification";
}

class ImageClassificationNode extends BasePipelineNode {
  private cachedInput?: Inputs;
  private cachedResult?: VisualBlocksClassificationResult;

  constructor() {
    super(ImageClassificationPipelineSingleton);
  }

  async runWithInputs(inputs: Inputs, services: Services) {
    const { image, modelid, device, quantized } = inputs;

    const _modelid = modelid?.trim();
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

    const classifier: ImageClassificationPipeline = await this.getInstance(
      _modelid,
      quantized,
      device
    );

    const result = await classifier(data, {
      topk: 5,
    });

    const resultArray = (
      Array.isArray(result) ? result : [result]
    ) as ImageClassificationOutput;

    const classProb = resultArray.map((e: any) => ({
      className: e.label,
      probability: e.score,
    }));
    this.cachedInput = inputs;
    this.cachedResult = { classes: classProb };

    this.dispatchEvent(
      new CustomEvent("outputs", {
        detail: { results: { classes: classProb } },
      })
    );
  }
}

export default {
  nodeSpec: NODE_SPEC,
  nodeImpl: ImageClassificationNode,
} as CustomNodeInfo;
