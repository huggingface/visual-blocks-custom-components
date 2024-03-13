import type {
  TextClassificationPipeline,
  TextClassificationSingle,
} from "@xenova/transformers";
import type {
  CustomNodeInfo,
  VisualBlocksClassificationResult,
} from "@visualblocks/custom-node-types";
import { NODE_SPEC } from "./text-classification-specs";
import {
  PipelineSingleton,
  BasePipelineNode,
  DevicesType,
} from "../../backends/client/base";
import { compareObjects } from "../../utils";

declare interface Inputs {
  text: string;
  quantized: boolean;
  modelid: string;
  device: DevicesType;
  modelid_curated: string;
}

class TextClassificationPipelineSingleton extends PipelineSingleton {
  static task = "text-classification";
}

class TextClassificationNode extends BasePipelineNode {
  private cachedInput?: Inputs;
  private cachedResult?: VisualBlocksClassificationResult;

  constructor() {
    super(TextClassificationPipelineSingleton);
  }

  async runWithInputs(inputs: Inputs) {
    const { text, modelid, modelid_curated, device, quantized } = inputs;

    const _modelid = (modelid || modelid_curated)?.trim();
    if (!text) {
      // No input node
      this.dispatchEvent(
        new CustomEvent("outputs", { detail: { results: null, text: text } })
      );
      return;
    }

    if (this.cachedResult && compareObjects(this.cachedInput, inputs)) {
      this.dispatchEvent(
        new CustomEvent("outputs", {
          detail: { results: this.cachedResult, text: text },
        })
      );
      return;
    }

    const classifier: TextClassificationPipeline = await this.getInstance(
      _modelid,
      quantized,
      device
    );

    const result = await classifier(text, {
      topk: 5,
    });

    const resultArray = (
      Array.isArray(result) ? result : [result]
    ) as TextClassificationSingle[];

    const classProb = resultArray.map((e) => ({
      className: e.label,
      probability: e.score,
    }));
    this.cachedInput = inputs;
    this.cachedResult = { classes: classProb };

    this.dispatchEvent(
      new CustomEvent("outputs", {
        detail: { results: { classes: classProb }, text: text },
      })
    );
  }
}

export default {
  nodeSpec: NODE_SPEC,
  nodeImpl: TextClassificationNode,
} as CustomNodeInfo;
