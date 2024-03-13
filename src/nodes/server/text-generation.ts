import { HfInference } from "@huggingface/inference";
import { NODE_SPEC } from "./text-generation-specs";
import { LitElement } from "lit";
import { compareObjects } from "../../utils";

declare interface Inputs {
  text: string;
  modelid: string;
  modelid_curated: string;
  apikey: string;
  temperature: number;
  repetition_penalty: number;
  max_new_tokens: number;
  return_full_text: boolean;
}
interface Outputs {
  results: string;
}

class TextGenerationServerNode extends LitElement {
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
    const {
      text,
      apikey,
      modelid,
      modelid_curated,
      temperature,
      repetition_penalty,
      max_new_tokens,
      return_full_text,
    } = inputs;

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
      const textGenerationRes = await this.hf?.textGeneration({
        model: _modelid,
        inputs: text,
        parameters: {
          repetition_penalty: repetition_penalty,
          max_new_tokens: max_new_tokens,
          return_full_text: return_full_text,
          temperature: temperature,
        },
      });
      if (!textGenerationRes) {
        throw new Error("Invalid response");
      }

      this.cachedOutput = {
        results: textGenerationRes.generated_text,
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

export default { nodeSpec: NODE_SPEC, nodeImpl: TextGenerationServerNode };
