import { COLLECTION_NAME_SERVER } from "../../constants";
import type { NodeSpec } from "@visualblocks/custom-node-types";
import {
  DataType,
  Category,
  EditorType,
} from "@visualblocks/custom-node-types";

const DEFAULT_MODEL_ID = "mistralai/Mixtral-8x7B-Instruct-v0.1";

export const NODE_SPEC: NodeSpec = {
  id: "hf-server-text-generation",
  name: "Text Generation",
  description:
    "Generating text is the task of generating new text given another text. These models can, for example, fill in incomplete text or paraphrase.",

  category: Category.PROCESSOR,
  collection: COLLECTION_NAME_SERVER,

  // Properties.
  propertySpecs: [],

  // Inputs.
  inputSpecs: [
    {
      name: "text",
      type: DataType.STRING,
      editorSpec: {
        type: EditorType.TEXT_AREA,
      },
    },
    {
      name: "temperature",
      displayLabel: "Temperature",
      type: DataType.NUMBER,
      defaultValue: 1.0,
      editorSpec: {
        type: EditorType.NUMBER,
        min: 0.1,
        max: 5.0,
        step: 0.1,
      },
    },
    {
      name: "max_new_tokens",
      displayLabel: "Max New Tokens",
      type: DataType.NUMBER,
      defaultValue: 200,
      editorSpec: {
        type: EditorType.NUMBER,
        min: 1,
        max: 2000,
        step: 1,
        integers: true,
      },
    },
    {
      name: "return_full_text",
      displayLabel: "Return Full Text",
      type: DataType.BOOLEAN,
      defaultValue: false,
      editorSpec: {
        type: EditorType.SLIDE_TOGGLE,
      },
    },
    {
      name: "repetition_penalty",
      displayLabel: "Repetition Penalty",
      type: DataType.NUMBER,
      defaultValue: 1.0,
      editorSpec: {
        type: EditorType.NUMBER,
        min: 1.0,
        max: 2.0,
        step: 0.1,
      },
    },
    {
      name: "modelid",
      displayLabel: "Model ID",
      type: DataType.STRING,
      defaultValue: DEFAULT_MODEL_ID,
      editorSpec: {
        type: EditorType.TEXT_INPUT,
      },
    },
    {
      name: "apikey",
      displayLabel: "API Key",
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
      name: "results",
      type: DataType.STRING,
    },
  ],
};
