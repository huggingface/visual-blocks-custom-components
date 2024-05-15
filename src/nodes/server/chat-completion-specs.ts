import { COLLECTION_NAME_SERVER, CURATED_MODELS } from "../../constants";
import { CustomDataTypeEnum } from "../../types";
import type { NodeSpec } from "@visualblocks/custom-node-types";
import {
  DataType,
  Category,
  EditorType,
} from "@visualblocks/custom-node-types";

const DEFAULT_MODEL_ID = "meta-llama/Meta-Llama-3-8B-Instruct";

export const NODE_SPEC: NodeSpec = {
  id: "hf-server-chat-completion",
  name: "Chat Completion",
  description:
    "Chat completion node make it easy to generate text on models endpoints compatible with OpenAI Chat Completion API",

  category: Category.PROCESSOR,
  collection: COLLECTION_NAME_SERVER,

  // Properties.
  propertySpecs: [],

  // Inputs.
  inputSpecs: [
    {
      name: "user",
      type: DataType.STRING,
      editorSpec: {
        type: EditorType.TEXT_AREA,
        autoResize: true,
        autoResizeMaxHeight: 150,
      },
    },
    {
      name: "assistant",
      type: DataType.STRING,
      editorSpec: {
        type: EditorType.TEXT_AREA,
        autoResize: true,
        autoResizeMaxHeight: 150,
      },
    },
    {
      name: "system",
      type: DataType.STRING,
      editorSpec: {
        type: EditorType.TEXT_AREA,
        autoResize: true,
        autoResizeMaxHeight: 150,
      },
    },
    {
      name: "temperature",
      displayLabel: "Temperature",
      type: DataType.NUMBER,
      defaultValue: 0.0,
      editorSpec: {
        type: EditorType.NUMBER,
        min: 0.1,
        max: 5.0,
        step: 0.1,
      },
    },
    {
      name: "max_tokens",
      displayLabel: "Max Tokens",
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
      name: "frequency_penalty",
      displayLabel: "Frequency Penalty",
      type: DataType.NUMBER,
      defaultValue: 0.0,
      editorSpec: {
        type: EditorType.NUMBER,
        min: -2.0,
        max: 2.0,
        step: 0.1,
      },
    },
    {
      name: "modelid",
      displayLabel: "Model ID",
      info: "Model ID or Endpoint URL compatible with OpenAI Chat Completion API",
      type: DataType.STRING,
      defaultValue: DEFAULT_MODEL_ID,
      editorSpec: {
        type: EditorType.DROPDOWN,
        options: CURATED_MODELS.chat_completion,
      },
    },
    {
      name: "endpointurl",
      displayLabel: "Endpoint URL",
      info: "Custom endpoint URL for the model compatible with OpenAI Chat Completion API",
      type: DataType.STRING,
      defaultValue: "",
      editorSpec: {
        type: EditorType.TEXT_INPUT,
      },
    },
    {
      name: "apikey",
      displayLabel: "API Key",
      type: CustomDataTypeEnum.HF_TOKEN,
      editorSpec: {
        type: EditorType.TEXT_INPUT,
        password: true,
      },
    },
    {
      name: "stream",
      displayLabel: "Stream",
      info: "Enable streaming mode to get partial results",
      type: DataType.BOOLEAN,
      defaultValue: true,
      editorSpec: {
        type: EditorType.SLIDE_TOGGLE,
      },
    },
  ],

  // Outputs.
  outputSpecs: [
    {
      name: "results",
      type: DataType.STRING,
      recommendedNodes: [
        {
          nodeSpecId: "markdown_viewer",
        },
      ],
    },
  ],
};
