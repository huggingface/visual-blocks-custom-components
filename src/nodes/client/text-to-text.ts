import type {
  Text2TextGenerationPipeline,
  Text2TextGenerationSingle,
} from "@xenova/transformers";
import type { CustomNodeInfo } from "@visualblocks/custom-node-types";
import {
  PipelineSingleton,
  BasePipelineNode,
  DevicesType,
} from "../../backends/client/base";
import { compareObjects } from "../../utils";

import { NODE_SPEC } from "./text-to-text-specs";

class Text2TextPipelineSingleton extends PipelineSingleton {
  static task = "text2text-generation";
}

declare interface Inputs {
  text: string;
  modelid: string;
  device: DevicesType;
  quantized: boolean;
}

class Text2TextGenerationNode extends BasePipelineNode {
  private cachedInput?: Inputs;
  private cachedResult?: Text2TextGenerationSingle;

  constructor() {
    super(Text2TextPipelineSingleton);
  }

  async runWithInputs(inputs: Inputs) {
    const { text, modelid, device, quantized } = inputs;

    const _modelid = modelid?.trim();
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
          detail: {
            results: this.cachedResult.generated_text,
            text: text,
          },
        })
      );
      return;
    }
    const translator: Text2TextGenerationPipeline = await this.getInstance(
      _modelid,
      quantized,
      device
    );

    const result = await translator(text);
    const resultSingle = (
      Array.isArray(result) ? result[0] : result
    ) as Text2TextGenerationSingle;
    // Output.
    this.cachedInput = inputs;
    this.cachedResult = resultSingle;

    this.dispatchEvent(
      new CustomEvent("outputs", {
        detail: {
          results: resultSingle.generated_text,
          text: text,
        },
      })
    );
  }
}

export default {
  nodeSpec: NODE_SPEC,
  nodeImpl: Text2TextGenerationNode,
} as CustomNodeInfo;
