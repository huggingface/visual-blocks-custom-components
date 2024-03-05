import type { CustomNodeInfo } from "@visualblocks/custom-node-types";
import {
  PipelineSingleton,
  BasePipelineNode,
} from "../../backends/client/base";
import type {
  TokenClassificationPipeline,
  TokenClassificationSingle,
  PreTrainedTokenizer,
} from "@xenova/transformers";

import { NODE_SPEC } from "../specs/token-classification-specs";

declare interface Inputs {
  text: string;
}

interface processedTokens {
  type: string;
  text: string;
}

class TokenClassificationPipelineSingleton extends PipelineSingleton {
  static task = "token-classification";
  static modelId = "Xenova/bert-base-multilingual-cased-ner-hrl";
  static quantized = true;
}

class TokenClassificationNode extends BasePipelineNode {
  constructor() {
    super(TokenClassificationPipelineSingleton);
  }

  postProcess(
    tokenizer: PreTrainedTokenizer,
    outputs: TokenClassificationSingle[]
  ): processedTokens[] {
    const chunks = [];
    let currentChunk: { type: string; text: number[] } = { type: "", text: [] };

    for (let i = 0; i < outputs.length; i++) {
      const word = tokenizer.model.tokens_to_ids.get(outputs[i].word);
      if (!word) {
        continue;
      }
      const entity = outputs[i].entity;

      if (entity.startsWith("B-")) {
        // beginning of a new chunk
        if (currentChunk.text.length > 0) {
          // push the current chunk if it exists
          chunks.push(currentChunk);
          currentChunk = { type: "", text: [] };
        }
        currentChunk.type = entity.slice(2); // get the type of the chunk
        currentChunk.text = [word];
      } else if (entity.startsWith("I-")) {
        // continuation of a chunk
        currentChunk.text.push(word);
      } else {
        // not part of a chunk (O tag)
        if (currentChunk.text.length > 0) {
          // push the current chunk if it exists

          if (currentChunk.type === "O") {
            currentChunk.text.push(word);
          } else {
            chunks.push(currentChunk);
            currentChunk = { type: "O", text: [word] };
          }
        } else {
          currentChunk = { type: "O", text: [word] };
        }
      }
    }

    // push the last chunk if it exists
    if (currentChunk.text.length > 0) {
      chunks.push(currentChunk);
    }

    return chunks.map((x) => ({
      type: x.type,
      text: tokenizer.decode(x.text),
    }));
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
    const classifier: TokenClassificationPipeline = await this.instance;

    const result = await classifier(text, {
      ignore_labels: [], // Return all labels
    });
    const resultArray = (
      Array.isArray(result) ? result : [result]
    ) as TokenClassificationSingle[];

    const tokens = this.postProcess(classifier.tokenizer, resultArray);

    this.dispatchEvent(
      new CustomEvent("outputs", {
        detail: {
          result: {
            tokens: tokens,
            results: resultArray,
          },
          text: text,
        },
      })
    );
  }
}

export default {
  nodeSpec: NODE_SPEC,
  nodeImpl: TokenClassificationNode,
} as CustomNodeInfo;
