import { COLLECTION_NAME_CLIENT } from "../../constants";
import { CustomDataTypeEnum } from "../../types";
import {
  DataType,
  Category,
  EditorType,
} from "@visualblocks/custom-node-types";
import type { NodeSpec } from "@visualblocks/custom-node-types";

const DEFAULT_MODEL_ID = "Xenova/segformer_b0_clothes";
export const NODE_SPEC: NodeSpec = {
  id: "hf-client-transformers-image-segmentation",
  name: "Image Segmentation",
  description: "Divides an image into segments where each pixel is mapped to an object.",

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
      name: "modelid",
      displayLabel: "Model ID",
      info: "Transformers.js Image Segmentation model ID",
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
