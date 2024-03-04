import { COLLECTION_NAME } from "../../constants";
import { DataType, Category } from "@visualblocks/custom-node-types";
import type { NodeSpec } from "@visualblocks/custom-node-types";

export const NODE_SPEC: NodeSpec = {
  id: "hf-client-transformers-object-detection",
  name: "Object detection (client)",
  description: "TODO",

  category: Category.PROCESSOR,
  collection: COLLECTION_NAME,

  // Properties.
  propertySpecs: [],

  // Inputs.
  inputSpecs: [
    {
      name: "image",
      type: DataType.IMAGE,
    },
  ],

  // Outputs.
  outputSpecs: [
    {
      name: "results",
      type: DataType.OBJECT_DETECTION_RESULT,
      recommendedNodes: [
        {
          nodeSpecId: "bounding_box_visualizer",
          extraInputIdsToConnect: ["image"],
        },
      ],
    },
  ],
};
