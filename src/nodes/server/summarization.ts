import { HfInference } from "@huggingface/inference";
import { NODE_SPEC } from "./summarization-specs";
import { LitElement } from "lit";
import { compareObjects } from "../../utils";

declare interface Inputs {
  text: string;
  modelid: string;
  modelid_curated: string;
  apikey: string;
}
interface Outputs {
  results: string;
  text: string;
}

class SummarizationNode extends LitElement {
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
    const { text, apikey, modelid, modelid_curated } = inputs;

    const _modelid = (modelid || modelid_curated)?.trim();
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
      const summResul = await this.hf?.summarization({
        model: _modelid,
        inputs: text,
      });
      if (!summResul?.summary_text) {
        throw new Error("Invalid response");
      }

      this.cachedOutput = {
        results: summResul.summary_text,
        text: text,
      };
      this.cachedInputs = inputs;

      this.dispatchEvent(
        new CustomEvent("outputs", { detail: this.cachedOutput })
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

export default { nodeSpec: NODE_SPEC, nodeImpl: SummarizationNode };
