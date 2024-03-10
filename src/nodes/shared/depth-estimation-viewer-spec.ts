import { COLLECTION_NAME_SHARED } from "../../constants";
import { CustomDataTypeEnum } from "../../types";
import { EditorType, DataType, Category } from "@visualblocks/custom-node-types";
import type { NodeSpec } from "@visualblocks/custom-node-types";

export const NODE_SPEC: NodeSpec = {
  id: "hf-transformers-depth-estimation-viewer",
  name: "Depth Estimation Viewer",
  description:
    "View the depth estimation result.",

  category: Category.OUTPUT,
  collection: COLLECTION_NAME_SHARED,

  // Properties.
  propertySpecs: [],

  // Inputs.
  inputSpecs: [
    {
      name: "depthData",
      type: CustomDataTypeEnum.DEPTH_ESTIMATION_RESULT,
      displayLabel: "Depth Data",
    },
    {
      name: "image",
      type: DataType.IMAGE,
      displayLabel: "Image",
    },
    {
      name: "displacement",
      type: DataType.NUMBER,
      displayLabel: "Displacement",
      defaultValue: 0.5,
      editorSpec: {
        type: EditorType.NUMBER,
        min: 0,
        max: 1,
        step: 0.01,
      }
    },
  ],

  // Outputs.
  outputSpecs: [
    {
      name: "depthData",
      displayLabel: "Depth Data",
      type: CustomDataTypeEnum.DEPTH_ESTIMATION_RESULT,
    },
    {
      name: "image",
      type: DataType.IMAGE,
    },
  ],
};
