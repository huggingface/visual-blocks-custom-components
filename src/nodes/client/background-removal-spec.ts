import { COLLECTION_NAME_CLIENT } from "../../constants";
import {
  DataType,
  Category,
  EditorType,
} from "@visualblocks/custom-node-types";
import type { NodeSpec } from "@visualblocks/custom-node-types";

export const NODE_SPEC: NodeSpec = {
  id: "hf-client-transformers-background-removal",
  name: "Background Removal",
  description: "Remove the background from an image.",

  category: Category.PROCESSOR,
  collection: COLLECTION_NAME_CLIENT,

  // Properties.
  propertySpecs: [],

  // Inputs.
  inputSpecs: [
    {
      name: "image",
      type: DataType.IMAGE,
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
      name: "foreground",
      displayLabel: "Foreground",
      type: DataType.IMAGE,
      recommendedNodes: [
        {
          nodeSpecId: "image_viewer",
        },
      ],
    },
  ],
};
