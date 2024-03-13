import { COLLECTION_NAME_SHARED, CURATED_MODELS } from "../../constants";
import type { NodeSpec } from "@visualblocks/custom-node-types";
import {
  DataType,
  Category,
  EditorType,
} from "@visualblocks/custom-node-types";

const DEFAULT_MODEL_ID = "mistralai/Mixtral-8x7B-Instruct-v0.1";

export const NODE_SPEC: NodeSpec = {
  id: "hf-chat-template-generator",
  name: "Chat Template Generator",
  description: "Assigning a label or class to a given text.",

  category: Category.PROCESSOR,
  collection: COLLECTION_NAME_SHARED,

  // Properties.
  propertySpecs: [
    {
      name: "modelid_curated",
      displayLabel: "Model ID",
      info: "Curated models from Hugging Face",
      type: DataType.STRING,
      defaultValue: DEFAULT_MODEL_ID,
      editorSpec: {
        type: EditorType.DROPDOWN,
        options: CURATED_MODELS.text_generation,
      },
    },
  ],
  // Inputs.
  inputSpecs: [
    {
      name: "user",
      type: DataType.STRING,
      editorSpec: {
        type: EditorType.TEXT_INPUT,
      },
    },
    {
      name: "assistant",
      type: DataType.STRING,
      editorSpec: {
        type: EditorType.TEXT_INPUT,
      },
    },
    {
      name: "system",
      type: DataType.STRING,
      editorSpec: {
        type: EditorType.TEXT_INPUT,
      },
    },
    {
      name: "modelid",
      displayLabel: "Model ID",
      info: "Transformers.js Text Classification model ID",
      type: DataType.STRING,
      editorSpec: {
        type: EditorType.TEXT_INPUT,
      },
    },
    {
      name: "add_generation_prompt",
      displayLabel: "Add Generation Prompt",
      defaultValue: false,
      type: DataType.BOOLEAN,
      editorSpec: {
        type: EditorType.SLIDE_TOGGLE,
      },
    },
  ],

  // Outputs.
  outputSpecs: [
    {
      name: "template",
      type: DataType.STRING,
      recommendedNodes: [
        {
          nodeSpecId: "hf-server-text-generation",
        },
      ],
    },
    {
      name: "modelid",
      displayLabel: "Model ID",
      type: DataType.STRING,
      recommendedNodes: [
        {
          nodeSpecId: "hf-server-text-generation",
          extraInputIdsToConnect: ["modelid"],
        },
      ],
    },
  ],
};
