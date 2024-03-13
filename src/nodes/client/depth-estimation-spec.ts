import { COLLECTION_NAME_CLIENT, CURATED_MODELS_CLIENT } from "../../constants";
import { CustomDataTypeEnum } from "../../types";
import {
  DataType,
  Category,
  EditorType,
} from "@visualblocks/custom-node-types";
import type { NodeSpec } from "@visualblocks/custom-node-types";

export const NODE_SPEC: NodeSpec = {
  id: "hf-client-transformers-depth-estimation",
  name: "Depth Estimation",
  description: "Predicting the depth of objects present in an image.",

  category: Category.PROCESSOR,
  collection: COLLECTION_NAME_CLIENT,

  propertySpecs: [
    {
      name: "modelid_curated",
      displayLabel: "Model ID",
      info: "Curated models from Hugging Face",
      type: DataType.STRING,
      editorSpec: {
        type: EditorType.DROPDOWN,
        options: CURATED_MODELS_CLIENT.depth_estimation,
      },
    },
  ],
  // Inputs.
  inputSpecs: [
    {
      name: "image",
      type: DataType.IMAGE,
    },
    {
      name: "modelid",
      displayLabel: "Model ID",
      info: "Transformers.js Depth Estimation model ID",
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
      name: "depthData",
      displayLabel: "Depth Data",
      type: CustomDataTypeEnum.DEPTH_ESTIMATION_RESULT,
      recommendedNodes: [
        {
          nodeSpecId: "hf-transformers-depth-estimation-viewer",
          extraInputIdsToConnect: ["image"],
        },
      ],
    },
  ],
};
