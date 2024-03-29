import { COLLECTION_NAME_CLIENT, CURATED_MODELS_CLIENT } from "../../constants";
import { Devices, CustomDataTypeEnum } from "../../types";
import { isWebGPUAvailable } from "../../utils";

import {
  DataType,
  Category,
  EditorType,
} from "@visualblocks/custom-node-types";
import type { NodeSpec } from "@visualblocks/custom-node-types";

export const NODE_SPEC: NodeSpec = {
  id: "hf-client-transformers-image-segmentation",
  name: "Image Segmentation",
  description:
    "Divides an image into segments where each pixel is mapped to an object.",

  category: Category.PROCESSOR,
  collection: COLLECTION_NAME_CLIENT,

  // Properties.
  propertySpecs: [
    {
      name: "device",
      displayLabel: "Device",
      defaultValue: isWebGPUAvailable() ? Devices.webgpu : Devices.wasm,
      type: CustomDataTypeEnum.DEVICES,
      editorSpec: {
        type: EditorType.DROPDOWN,
        options: Object.values(Devices).map((value) => ({
          value,
          label: value,
        })),
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
      hideCondition: {
        propertyValues: { device: [Devices.webgpu] },
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
      info: "Transformers.js Image Segmentation model ID",
      type: DataType.STRING,
      editorSpec: {
        type: EditorType.DROPDOWN,
        options: CURATED_MODELS_CLIENT.image_segmentation,
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
