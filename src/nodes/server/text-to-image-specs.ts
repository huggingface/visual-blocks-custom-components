import { COLLECTION_NAME } from "../../constants";
import type { NodeSpec } from "@visualblocks/custom-node-types";
import {
  DataType,
  Category,
  EditorType,
} from "@visualblocks/custom-node-types";

const DEFAULT_MODEL_ID = "stabilityai/stable-diffusion-xl-base-1.0";

export const NODE_SPEC: NodeSpec = {
  id: "hf-server-text-to-image",
  name: "Text to Image (server)",
  description: "TODO",

  category: Category.PROCESSOR,
  collection: COLLECTION_NAME,

  // Properties.
  propertySpecs: [],
  // Inputs.
  inputSpecs: [
    {
      name: "prompt",
      displayLabel: "Prompt",
      info: "Text prompt to guide image generation.",
      type: DataType.STRING,
      editorSpec: {
        type: EditorType.TEXT_INPUT,
      },
    },
    {
      name: "negative_prompt",
      info: "Prompt to guide what NOT to include in image generation.",
      displayLabel: "Negative Prompt",
      type: DataType.STRING,
      editorSpec: {
        type: EditorType.TEXT_INPUT,
      },
    },
    {
      name: "num_inference_steps",
      info: "Number of inference steps",
      displayLabel: "Steps",
      type: DataType.NUMBER,
      defaultValue: 25,
      editorSpec: {
        type: EditorType.NUMBER,
        min: 1,
        max: 40,
        step: 1,
        integers: true,
      },
    },
    {
      name: "guidance_scale",
      displayLabel: "Guidance Scale",
      info: "A higher guidance scale value encourages the model to generate images closely linked to the text prompt at the expense of lower image quality",
      type: DataType.NUMBER,
      defaultValue: 7.5,
      editorSpec: {
        type: EditorType.NUMBER,
        min: 0,
        max: 50,
      },
    },
    {
      name: "seed",
      displayLabel: "Seed",
      info: "Random seed",
      type: DataType.NUMBER,
      editorSpec: {
        type: EditorType.NUMBER,
        min: 0,
        max: Number.MAX_SAFE_INTEGER,
        step: 1,
        integers: true,
      },
    },
    {
      name: "useCache",
      displayLabel: "Use Cache",
      info: "Disable inference cache to get new results",
      defaultValue: true,
      type: DataType.BOOLEAN,
      editorSpec: {
        type: EditorType.SLIDE_TOGGLE,
      },
    },
    {
      name: "modelid",
      displayLabel: "Model ID",
      info: "Hugging Face model ID",
      defaultValue: DEFAULT_MODEL_ID,
      type: DataType.STRING,
      editorSpec: {
        type: EditorType.TEXT_INPUT,
      },
    },
    {
      name: "apikey",
      displayLabel: "API Key",
      info: "Hugging Face API Key",
      type: DataType.STRING,
      editorSpec: {
        type: EditorType.TEXT_INPUT,
        password: true,
      },
    },
  ],

  // Outputs.
  outputSpecs: [
    {
      name: "result",
      type: DataType.STRING,
      recommendedNodes: [
        {
          nodeSpecId: "base64_to_image",
        },
      ],
    },
  ],
};
