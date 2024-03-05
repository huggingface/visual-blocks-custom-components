import { COLLECTION_NAME } from "../../constants";
import { CustomDataTypeEnum } from "../../types";
import { DataType, Category } from "@visualblocks/custom-node-types";
import type { NodeSpec } from "@visualblocks/custom-node-types";

export const NODE_SPEC: NodeSpec = {
  id: "hf-client-transformers-image-segmentation",
  name: "Image segmentation (client)",
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
      name: "segData",
      displayLabel: "Seg Data",
      type: CustomDataTypeEnum.IMAGE_SEGMENTATION_RESULT,
      recommendedNodes: [
        {
          nodeSpecId: "hf-transformers-image-segmentation-viewer",
        },
      ],
    },
  ],
};
