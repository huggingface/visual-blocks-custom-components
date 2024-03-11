import { COLLECTION_NAME_CLIENT } from "../../constants";
import type { NodeSpec } from "@visualblocks/custom-node-types";
import {
  DataType,
  Category,
  EditorType,
} from "@visualblocks/custom-node-types";

const DEFAULT_MODEL_ID = "Xenova/t5-small";

export const NODE_SPEC: NodeSpec = {
  id: "hf-client-transformers-translation",
  name: "Translation",
  description: "Converting text from one language to another.",

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
            value: "German",
            label: "German",
          },
          {
            value: "Romanian",
            label: "Romanian",
          },
          {
            value: "French",
            label: "French",
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
      info: "Transformers.js Translation model ID",
      defaultValue: DEFAULT_MODEL_ID,
      type: DataType.STRING,
      editorSpec: {
        type: EditorType.TEXT_INPUT,
      },
    },
    {
      name: "quantized",
      displayLabel: "Quantized Model",
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
      name: "results",
      type: DataType.STRING,
    },
    {
      name: "text",
      type: DataType.STRING,
    },
  ],
};
