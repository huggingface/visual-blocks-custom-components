import { COLLECTION_NAME_SERVER } from "../../constants";
import type { NodeSpec } from "@visualblocks/custom-node-types";
import {
  DataType,
  Category,
  EditorType,
} from "@visualblocks/custom-node-types";

const DEFAULT_MODEL_ID = "google/vit-base-patch16-224";

export const NODE_SPEC: NodeSpec = {
  id: "hf-server-transformers-image-classification",
  name: "Image Classification",
  description: "Assigning a label or class to an entire image.",

  category: Category.PROCESSOR,
  collection: COLLECTION_NAME_SERVER,

  // Properties.
  propertySpecs: [],

  // Inputs.
  inputSpecs: [
    {
      name: "image",
      type: DataType.IMAGE,
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
      type: DataType.CLASSIFICATION_RESULT,
      recommendedNodes: [
        {
          nodeSpecId: "classification_visualizer",
        },
      ],
    },
  ],
};