import { COLLECTION_NAME_CLIENT } from "../../constants";
import type { NodeSpec } from "@visualblocks/custom-node-types";
import {
  DataType,
  Category,
  EditorType,
} from "@visualblocks/custom-node-types";

// const DEFAULT_MODEL_ID = "Xenova/LaMini-Flan-T5-783M";
const DEFAULT_MODEL_ID = "Xenova/LaMini-Flan-T5-77M";

export const NODE_SPEC: NodeSpec = {
  id: "hf-client-transformers-translation",
  name: "Translation",
  description: "TODO",

  category: Category.PROCESSOR,
  collection: COLLECTION_NAME_CLIENT,

  // Properties.
  propertySpecs: [
    {
      name: "language",
      type: DataType.STRING,
      editorSpec: {
        type: EditorType.DROPDOWN,
        options: [
          {
            value: "French",
            label: "French",
          },
          {
            value: "German",
            label: "German",
          },
          {
            value: "Romanian",
            label: "Romanian",
          },
        ],
      },
    },
  ],

  // Inputs.
  inputSpecs: [
    {
      name: "text",
      type: DataType.STRING,
      editorSpec: {
        type: EditorType.TEXT_INPUT,
      },
    },
    {
      name: "modelid",
      displayLabel: "Model ID",
      info: "Transformer.js Image Segmentation model ID",
      defaultValue: DEFAULT_MODEL_ID,
      type: DataType.STRING,
      editorSpec: {
        type: EditorType.TEXT_INPUT,
      },
    },
    {
      name: "quantized",
      displayLabel: "Quantized Model",
      defaultValue: true,
      type: DataType.BOOLEAN,
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
    },
    {
      name: "text",
      type: DataType.STRING,
    },
  ],
};
