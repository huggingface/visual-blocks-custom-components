import { COLLECTION_NAME_CLIENT } from "../../constants";
import type { NodeSpec } from "@visualblocks/custom-node-types";
import {
  DataType,
  Category,
  EditorType,
} from "@visualblocks/custom-node-types";

const DEFAULT_MODEL_ID =
  "Xenova/distilbert-base-uncased-finetuned-sst-2-english";

export const NODE_SPEC: NodeSpec = {
  id: "hf-client-transformers-text-classification",
  name: "Text Classification",
  description: "Assigning a label or class to a given text.",

  category: Category.PROCESSOR,
  collection: COLLECTION_NAME_CLIENT,

  // Properties.
  propertySpecs: [],

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
      info: "Transformers.js Text Classification model ID",
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
      type: DataType.CLASSIFICATION_RESULT,
      recommendedNodes: [
        {
          nodeSpecId: "classification_visualizer",
        },
      ],
    },
    {
      name: "text",
      type: DataType.STRING,
    },
  ],
};
