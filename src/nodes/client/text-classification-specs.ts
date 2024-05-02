import { COLLECTION_NAME_CLIENT, CURATED_MODELS_CLIENT } from "../../constants";
import type { NodeSpec } from "@visualblocks/custom-node-types";
import { Devices, CustomDataTypeEnum } from "../../types";
import { isWebGPUAvailable } from "../../utils";

import {
  DataType,
  Category,
  EditorType,
} from "@visualblocks/custom-node-types";

export const NODE_SPEC: NodeSpec = {
  id: "hf-client-transformers-text-classification",
  name: "Text Classification",
  description: "Assigning a label or class to a given text.",

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
      name: "text",
      type: DataType.STRING,
      editorSpec: {
        type: EditorType.TEXT_AREA,
        autoResize: true,
        autoResizeMaxHeight: 150,
      },
    },
    {
      name: "modelid",
      displayLabel: "Model ID",
      info: "Transformers.js Text Classification model ID",
      type: DataType.STRING,
      editorSpec: {
        type: EditorType.DROPDOWN,
        options: CURATED_MODELS_CLIENT.text_classification,
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
    {
      name: "text",
      type: DataType.STRING,
    },
  ],
};
