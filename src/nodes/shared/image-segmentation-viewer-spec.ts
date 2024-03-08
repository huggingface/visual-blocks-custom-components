import { COLLECTION_NAME_SHARED } from "../../constants";
import { CustomDataTypeEnum } from "../../types";
import { DataType, Category } from "@visualblocks/custom-node-types";
import type { NodeSpec } from "@visualblocks/custom-node-types";

export const NODE_SPEC: NodeSpec = {
  id: "hf-transformers-image-segmentation-viewer",
  name: "Image segmentation Viewer",
  description:
    "View the image segmentation result. Click on the image to see the segmentation mask to select segments, CMD/CTRL + click to clear selection.",

  category: Category.OUTPUT,
  collection: COLLECTION_NAME_SHARED,

  // Properties.
  propertySpecs: [],

  // Inputs.
  inputSpecs: [
    {
      name: "segData",
      type: CustomDataTypeEnum.IMAGE_SEGMENTATION_RESULT,
      displayLabel: "Seg Data",
    },
    {
      name: "image",
      type: DataType.IMAGE,
      displayLabel: "Image",
    },
  ],

  // Outputs.
  outputSpecs: [
    {
      name: "segData",
      displayLabel: "Seg Data",
      type: CustomDataTypeEnum.IMAGE_SEGMENTATION_RESULT,
    },
    {
      name: "image",
      type: DataType.IMAGE,
    },
  ],
};
