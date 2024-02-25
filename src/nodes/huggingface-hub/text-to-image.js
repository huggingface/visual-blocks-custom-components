import { HfInference } from "@huggingface/inference";
import { HF_HUB_COLLECTION } from "../../constants.js";
import { getHubModels, blobToBase64 } from "../../utils.js";
import { LitElement } from "lit";
const PIPELINE_TAG = "text-to-image";

const NODE_SPEC = {
  id: "hf-hub-text-to-image",
  name: "Text to Image",
  description: "TODO",

  category: "processor",
  collection: HF_HUB_COLLECTION,

  // Properties.
  propertySpecs: [
    {
      name: "topmodelid",
      displayLabel: "Top 20 Models",
      type: "string",
      info: "Top 20 most downloaded models for text-to-image",
      editorSpec: {
        type: "dropdown",
        options: await getHubModels(PIPELINE_TAG),
      },
    },
  ],
  // Inputs.
  inputSpecs: [
    {
      name: "prompt",
      displayLabel: "Prompt",
      type: "string",
      editorSpec: {
        type: "text_input",
      },
    },
    {
      name: "negative_prompt",
      displayLabel: "Negative Prompt",
      type: "string",
      editorSpec: {
        type: "text_input",
      },
    },
    {
      name: "num_inference_steps",
      displayLabel: "Steps",
      type: "number",
      defaultValue: 25,
      editorSpec: {
        type: "number",
        min: 1,
        max: 40,
        step: 1,
        integers: true,
      },
    },
    {
      name: "guidance_scale",
      displayLabel: "Guidance Scale",
      type: "number",
      defaultValue: 7.5,
      editorSpec: {
        type: "number",
        min: 0,
        max: 50,
      },
    },
    {
      name: "seed",
      displayLabel: "Seed",
      type: "number",
      editorSpec: {
        type: "number",
        min: 0,
        max: Number.MAX_SAFE_INTEGER,
        step: 1,
        integers: true,
      },
    },
    {
      name: "modelid",
      displayLabel: "Model ID",
      info: "Hugging Face model ID",
      type: "string",
      editorSpec: {
        type: "text_input",
      },
    },
    {
      name: "apikey",
      displayLabel: "API Key",
      info: "Hugging Face API Key",
      type: "string",
      recommendedNodes: [
        {
          nodeSpecId: "hf-hub-login",
        },
      ],

      //   editorSpec: {
      //     type: "text_input",
      //   },
    },
  ],

  // Outputs.
  outputSpecs: [
    {
      name: "result",
      type: "string",
      info: "Base64 encoded image",
      recommendedNodes: [
        {
          nodeSpecId: "base64_to_image",
        },
      ],
    },
  ],
};

class TextToImageNode extends LitElement {
  constructor() {
    super();
  }

  render() {
    // This node doesn't have a preview UI.
  }
  async runWithInputs(inputs) {
    const {
      prompt,
      negative_prompt,
      num_inference_steps,
      guidance_scale,
      seed,
      apikey,
      modelid,
      topmodelid,
    } = inputs;

    try {
      const hf = new HfInference(apikey);
      const imageBlob = await hf.textToImage(
        {
          model: modelid ? modelid.trim() : topmodelid.trim(),
          inputs: prompt,
          parameters: {
            negative_prompt,
            num_inference_steps,
            guidance_scale,
            seed,
          },
        },
        { wait_for_model: true }
      );

      const base64img = await blobToBase64(imageBlob);
      console.log(base64img.slice(0, 100));
      this.dispatchEvent(
        new CustomEvent("outputs", {
          detail: {
            result: base64img.replace(
              /data:image\/png;base64,|data:image\/jpeg;base64,/g,
              ""
            ),
          },
        })
      );
    } catch (error) {
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
