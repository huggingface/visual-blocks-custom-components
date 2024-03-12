import { COLLECTION_NAME_CLIENT } from "../../constants";
import { DevicesType, Devices, CustomDataTypeEnum } from "../../types";
import {
  DataType,
  Category,
  EditorType,
} from "@visualblocks/custom-node-types";
import type { NodeSpec } from "@visualblocks/custom-node-types";
import { isWebGPUAvailable } from "../../utils";

const DEFAULT_MODEL_ID = "briaai/RMBG-1.4@refs/pr/16";

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
      name: "modelid",
      displayLabel: "Model ID",
      info: "Transformers.js Depth Estimation model ID",
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
