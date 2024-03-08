import { HfInference } from "@huggingface/inference";
import { NODE_SPEC } from "./token-classification-specs";
import { LitElement } from "lit";
import { compareObjects } from "../../utils";
import type { TokenClassificationResult, ProcessedTokens } from "../../types";

declare interface Inputs {
  text: string;
  modelid: string;
  apikey: string;
}

class TokenClassificationNode extends LitElement {
  private cachedInputs?: Inputs;
  private cachedResult?: TokenClassificationResult;
  private hf?: HfInference;

  constructor() {
    super();
    this.hf = new HfInference();
  }

  render() {
    // This node doesn't have a preview UI.
  }
  async runWithInputs(inputs: Inputs) {
    const { text, modelid, apikey } = inputs;
    if (this.hf && apikey) {
      this.hf = new HfInference(apikey);
    }

    if (!text) {
      this.dispatchEvent(
        new CustomEvent("outputs", { detail: { result: null } })
      );
      return;
    }

    if (this.cachedResult && compareObjects(this.cachedInputs, inputs)) {
      this.dispatchEvent(
        new CustomEvent("outputs", {
          detail: {
            results: {
              tokens: this.cachedResult,
            },
            text: text,
          },
        })
      );
      return;
    }

    try {
      const tokenClassResult = await this.hf?.tokenClassification({
        model: modelid.trim(),
        inputs: text,
        parameters: {
          aggregation_strategy: "max",
        },
      });

      if (!tokenClassResult) {
        throw new Error("Invalid response");
      }

      const tokens = tokenClassResult.map((x: any) => ({
        type: x.entity_group,
        text: x.word,
      }));

      this.cachedInputs = inputs;
      this.cachedResult = tokens;

      this.dispatchEvent(
        new CustomEvent("outputs", {
          detail: {
            results: {
              tokens: tokens,
            },
            text: text,
          },
        })
      );
    } catch (error: any) {
      this.dispatchEvent(
        new CustomEvent("outputs", {
          detail: {
            error: {
              title: "Error",
              message: error.message,
            },
          },
        })
      );
    }
  }
}

export default { nodeSpec: NODE_SPEC, nodeImpl: TokenClassificationNode };
