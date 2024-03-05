import type {
  Text2TextGenerationPipeline,
  Text2TextGenerationSingle,
} from "@xenova/transformers";
import type { CustomNodeInfo } from "@visualblocks/custom-node-types";
import {
  PipelineSingleton,
  BasePipelineNode,
} from "../../backends/client/base.js";

import { NODE_SPEC } from "../specs/translation-specs";

class Text2TextPipelineSingleton extends PipelineSingleton {
  static task = "text2text-generation";
  // static modelId = "Xenova/LaMini-Flan-T5-783M";
  static modelId = "Xenova/LaMini-Flan-T5-77M";
  static quantized = true;
}

declare interface Inputs {
  text: string;
  language: string;
}

class Text2TextGenerationNode extends BasePipelineNode {
  private cachedInput: string | null = null;
  private cachedLang: string | null = null;
  private cachedOutput: string | null = null;

  constructor() {
    super(Text2TextPipelineSingleton);
  }

  async runWithInputs(inputs: Inputs) {
    const { text, language } = inputs;
    if (!text) {
      // No input node
      this.dispatchEvent(
        new CustomEvent("outputs", { detail: { result: null } })
      );
      return;
    }
    if (
      this.cachedOutput &&
      this.cachedInput === text &&
      this.cachedLang === language
    ) {
      this.dispatchEvent(
        new CustomEvent("outputs", {
          detail: { result: this.cachedOutput, text: text },
        })
      );
      return;
    }

    const translator: Text2TextGenerationPipeline = await this.instance;

    const prompt = `translate English to ${language}: ${text}`;
    // TODO: Live updates to UI, then dispatch final result at end
    const result = await translator(prompt);
    const resultSingle = (
      Array.isArray(result) ? result[0] : result
    ) as Text2TextGenerationSingle;

    this.cachedInput = text;
    this.cachedLang = language;
    this.cachedOutput = resultSingle.generated_text;

    this.dispatchEvent(
      new CustomEvent("outputs", {
        detail: { result: resultSingle.generated_text, text: text },
      })
    );
  }
}

export default {
  nodeSpec: NODE_SPEC,
  nodeImpl: Text2TextGenerationNode,
} as CustomNodeInfo;
