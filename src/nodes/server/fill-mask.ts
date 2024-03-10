import type { VisualBlocksClassificationResult } from "@visualblocks/custom-node-types";
import { HfInference } from "@huggingface/inference";
import { NODE_SPEC } from "./fill-mask-specs";
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

class FillMaskNode extends LitElement {
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
      const fillMasksRes = await this.hf?.fillMask({
        model: modelid.trim(),
        inputs: text,
      });
      if (!fillMasksRes) {
        throw new Error("Invalid response");
      }
      // remap to visualblocks classification result
      const result = fillMasksRes.map((e) => ({
        className: e.token_str,
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

export default { nodeSpec: NODE_SPEC, nodeImpl: FillMaskNode };
