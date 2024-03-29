import {
  COLLECTION_NAME_CLIENT,
  CURATED_MODELS_CLIENT,
  LANGUAGES,
} from "../../constants";
import { Devices, CustomDataTypeEnum } from "../../types";
import { isWebGPUAvailable } from "../../utils";

import type { NodeSpec } from "@visualblocks/custom-node-types";
import {
  DataType,
  Category,
  EditorType,
} from "@visualblocks/custom-node-types";

export const NODE_SPEC: NodeSpec = {
  id: "hf-client-transformers-translation",
  name: "Translation",
  description: "Converting text from one language to another.",

  category: Category.PROCESSOR,
  collection: COLLECTION_NAME_CLIENT,

  // Properties.
  propertySpecs: [
    {
      name: "source_language",
      type: DataType.STRING,
      defaultValue: "eng_Latn",
      displayLabel: "Source",
      editorSpec: {
        type: EditorType.DROPDOWN,
        options: Object.entries(LANGUAGES).map(([label, value]) => ({
          value,
          label,
        })),
      },
    },
    {
      name: "target_language",
      type: DataType.STRING,
      displayLabel: "Target",
      defaultValue: "fra_Latn",
      editorSpec: {
        type: EditorType.DROPDOWN,
        options: Object.entries(LANGUAGES).map(([label, value]) => ({
          value,
          label,
        })),
      },
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
        type: EditorType.TEXT_INPUT,
      },
    },
    {
      name: "modelid",
      displayLabel: "Model ID",
      info: "Transformers.js Translation model ID",
      type: DataType.STRING,
      editorSpec: {
        type: EditorType.DROPDOWN,
        options: CURATED_MODELS_CLIENT.translation,
      },
    },
  ],

  // Outputs.
  outputSpecs: [
    {
      name: "results",
      type: DataType.STRING,
    },
    {
      name: "text",
      type: DataType.STRING,
    },
  ],
};
