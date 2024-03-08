import { HfInference } from "@huggingface/inference";
import { NODE_SPEC } from "./text-to-image-specs";
import { LitElement } from "lit";
import { blobToBase64, compareObjects } from "../../utils";

interface Inputs {
  prompt: string;
  negative_prompt: string;
  num_inference_steps: number;
  guidance_scale: number;
  seed: number;
  modelid: string;
  apikey: string;
  useCache: boolean;
}

interface Outputs {
  result: string;
}

class TextToImageNode extends LitElement {
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
      prompt,
      negative_prompt,
      num_inference_steps,
      guidance_scale,
      seed,
      modelid,
      apikey,
      useCache,
    } = inputs;

    if (this.hf && apikey) {
      this.hf = new HfInference(apikey);
    }

    if (!prompt) {
      this.dispatchEvent(
        new CustomEvent("outputs", { detail: { result: null } })
      );
      return;
    }

    if (this.cachedOutput && compareObjects(this.cachedInputs, inputs)) {
      console.info("Using cached output");
      this.dispatchEvent(
        new CustomEvent("outputs", { detail: this.cachedOutput })
      );
      return;
    }

    try {
      const imageBlob = await this.hf?.textToImage(
        {
          model: modelid.trim(),
          inputs: prompt,
          parameters: {
            negative_prompt,
            num_inference_steps,
            guidance_scale,
            // @ts-ignore
            seed,
          },
        },
        { wait_for_model: true, use_cache: useCache }
      );

      if (!imageBlob) {
        throw new Error("Invalid response");
      }

      const base64img = (await blobToBase64(imageBlob)) as string;
      const output = base64img.replace(
        /data:image\/png;base64,|data:image\/jpeg;base64,/g,
        ""
      );
      this.cachedOutput = { result: output };
      this.cachedInputs = inputs;

      this.dispatchEvent(
        new CustomEvent("outputs", {
          detail: { result: output },
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

export default { nodeSpec: NODE_SPEC, nodeImpl: TextToImageNode };
