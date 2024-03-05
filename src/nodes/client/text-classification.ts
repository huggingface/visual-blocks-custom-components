import type {
  TextClassificationPipeline,
  TextClassificationSingle,
} from "@xenova/transformers";
import type {
  CustomNodeInfo,
  VisualBlocksClassificationResult,
} from "@visualblocks/custom-node-types";
import { NODE_SPEC } from "../specs/text-classification-specs";
import {
  PipelineSingleton,
  BasePipelineNode,
} from "../../backends/client/base";

declare interface Inputs {
  text: string;
}

class TextClassificationPipelineSingleton extends PipelineSingleton {
  static task = "text-classification";
  static modelId = "Xenova/distilbert-base-uncased-finetuned-sst-2-english";
  static quantized = true;
}

class TextClassificationNode extends BasePipelineNode {
  private cachedInput: string | null = null;
  private cachedResult: VisualBlocksClassificationResult | null = null;

  constructor() {
    super(TextClassificationPipelineSingleton);
  }

  async runWithInputs(inputs: Inputs) {
    const { text } = inputs;
    if (!text) {
      // No input node
      this.dispatchEvent(
        new CustomEvent("outputs", { detail: { result: null, text: text } })
      );
      return;
    }
    if (this.cachedResult && this.cachedInput === text) {
      this.dispatchEvent(
        new CustomEvent("outputs", {
          detail: { result: this.cachedResult, text: text },
        })
      );
      return;
    }
    const classifier: TextClassificationPipeline = await this.instance;

    const result = await classifier(text, {
      topk: 5,
    });

    const resultArray = (
      Array.isArray(result) ? result : [result]
    ) as TextClassificationSingle[];

    const classProb: VisualBlocksClassificationResult = {
      classes: resultArray.map((e) => ({
        className: e.label,
        probability: e.score,
      })),
    };
    this.cachedInput = text;
    this.cachedResult = classProb;

    this.dispatchEvent(
      new CustomEvent("outputs", {
        detail: { result: classProb, text: text },
      })
    );
  }
}

export default {
  nodeSpec: NODE_SPEC,
  nodeImpl: TextClassificationNode,
} as CustomNodeInfo;
