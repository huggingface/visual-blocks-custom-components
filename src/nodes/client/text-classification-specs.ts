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
  description: "TODO",

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
      name: "result",
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
