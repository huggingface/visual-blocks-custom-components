import type { VisualBlocksClassificationResult } from "@visualblocks/custom-node-types";
import { HfInference } from "@huggingface/inference";
import { NODE_SPEC } from "./text-classification-specs";
import { LitElement } from "lit";
import { compareObjects } from "../../utils";

declare interface Inputs {
  text: string;
  modelid: string;
  apikey: string;
}
interface Outputs {
  results: VisualBlocksClassificationResult;
}

class TextClassificationNode extends LitElement {
  private cachedInputs?: Inputs;
  private cachedOutput?: Outputs;
  private hf?: HfInference;

  constructor() {
    super();
    this.hf = new HfInference();
  }

  render() {
    // This node doesn't have a preview UI.
  }
  async runWithInputs(inputs: Inputs) {
    const { text, apikey, modelid } = inputs;

    if (this.hf && apikey) {
      this.hf = new HfInference(apikey);
    }

    if (!text) {
      this.dispatchEvent(
        new CustomEvent("outputs", { detail: { results: null } })
      );
      return;
    }

    if (this.cachedOutput && compareObjects(this.cachedInputs, inputs)) {
      this.dispatchEvent(
        new CustomEvent("outputs", { detail: this.cachedOutput })
      );
      return;
    }

    try {
      const textClassRes = await this.hf?.textClassification({
        model: modelid.trim(),
        inputs: text,
      });
      if (!textClassRes) {
        throw new Error("Invalid response");
      }
      // remap to visualblocks classification result
      const result = textClassRes.map((e) => ({
        className: e.label,
        probability: e.score,
      }));

      const output: Outputs = {
        results: { classes: result },
      };
      this.cachedOutput = output;
      this.cachedInputs = inputs;

      this.dispatchEvent(new CustomEvent("outputs", { detail: output }));
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

export default { nodeSpec: NODE_SPEC, nodeImpl: TextClassificationNode };
