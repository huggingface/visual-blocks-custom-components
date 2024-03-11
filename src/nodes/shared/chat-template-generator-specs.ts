import { COLLECTION_NAME_SHARED } from "../../constants";
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
  propertySpecs: [],

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
      defaultValue: DEFAULT_MODEL_ID,
      type: DataType.STRING,
      editorSpec: {
        type: EditorType.TEXT_INPUT,
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