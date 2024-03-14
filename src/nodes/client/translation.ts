import {
  PipelineSingleton,
  BasePipelineNode,
  DevicesType,
} from "../../backends/client/base";
import { compareObjects } from "../../utils";

import { NODE_SPEC } from "./translation-specs";

import type {
  TranslationPipeline,
  TranslationSingle,
} from "@xenova/transformers";
import type { CustomNodeInfo } from "@visualblocks/custom-node-types";

class TranslationNodeSingleton extends PipelineSingleton {
  static task = "translation";
}

declare interface Inputs {
  text: string;
  target_language: string;
  source_language: string;
  modelid: string;
  device: DevicesType;
  modelid_curated: string;
  quantized: boolean;
}
interface Outputs {
  results: string;
  text: string;
}

class TranslationNode extends BasePipelineNode {
  private cachedInput?: Inputs;
  private cachedResult?: Outputs;

  constructor() {
    super(TranslationNodeSingleton);
  }

  async runWithInputs(inputs: Inputs) {
    const {
      text,
      target_language,
      source_language,
      modelid,
      modelid_curated,
      device,
      quantized,
    } = inputs;

    const _modelid = (modelid || modelid_curated)?.trim();
    if (!text) {
      // No input node
      this.dispatchEvent(
        new CustomEvent("outputs", { detail: { results: null } })
      );
      return;
    }
    if (this.cachedResult && compareObjects(this.cachedInput, inputs)) {
      this.dispatchEvent(
        new CustomEvent("outputs", {
          detail: this.cachedResult,
        })
      );
      return;
    }
    const translator: TranslationPipeline = await this.getInstance(
      _modelid,
      quantized,
      device
    );

    // TODO: Live updates to UI, then dispatch final result at end
    const result = await translator(text, {
      // @ts-ignore
      src_lang: source_language,
      tgt_lang: target_language,
    });
    const resultSingle = (
      Array.isArray(result) ? result[0] : result
    ) as TranslationSingle;

    // Output.
    this.cachedInput = inputs;
    this.cachedResult = {
      results: resultSingle.translation_text,
      text: text,
    };

    this.dispatchEvent(
      new CustomEvent("outputs", {
        detail: this.cachedResult,
      })
    );
  }
}

export default {
  nodeSpec: NODE_SPEC,
  nodeImpl: TranslationNode,
} as CustomNodeInfo;
