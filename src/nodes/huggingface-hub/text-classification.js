import { HfInference } from "@huggingface/inference";
import { HF_HUB_COLLECTION } from "../../constants.js";
import { getHubModels } from "../../utils.js";

import { LitElement } from "lit";
const PIPELINE_TAG = "text-classification";

const NODE_SPEC = {
  id: "hf-hub-text-classification",
  name: "Text Classification",
  description: "TODO",

  category: "processor",
  collection: HF_HUB_COLLECTION,

  // Properties.
  propertySpecs: [
    {
      name: "topmodelid",
      displayLabel: "Top 20 Models",
      type: "string",
      info: "Top 20 most downloaded models for text classification",
      editorSpec: {
        type: "dropdown",
        options: await getHubModels(PIPELINE_TAG),
      },
    },
  ],
  // Inputs.
  inputSpecs: [
    {
      name: "text",
      displayLabel: "Text",
      info: "Text to classify",
      type: "string",
      editorSpec: {
        type: "text_input",
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
      type: "classificationResult",
    },
  ],
};

class TextClassificationNode extends LitElement {
  constructor() {
    super();
  }

  render() {
    // This node doesn't have a preview UI.
  }
  async runWithInputs(inputs) {
    const { text, apikey, modelid, topmodelid } = inputs;
    if (!text) {
      this.dispatchEvent(
        new CustomEvent("outputs", { detail: { result: null } })
      );
      return;
    }
    try {
      const hf = new HfInference(apikey);
      const textClassRes = await hf.textClassification(
        {
          model: modelid ? modelid.trim() : topmodelid.trim(),
          inputs: text,
        },
        { wait_for_model: true }
      );
      // remap to visualblocks classification result
      const result = textClassRes.map((e) => ({
        className: e.label,
        probability: e.score,
      }));
      this.dispatchEvent(
        new CustomEvent("outputs", { detail: { result: { classes: result } } })
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

export default { nodeSpec: NODE_SPEC, nodeImpl: TextClassificationNode };
