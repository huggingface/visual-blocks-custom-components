import { COLLECTION_NAME_CLIENT } from "../../constants";
import {
  DataType,
  Category,
  EditorType,
} from "@visualblocks/custom-node-types";
import type { NodeSpec } from "@visualblocks/custom-node-types";

const DEFAULT_MODEL_ID = "Xenova/detr-resnet-50";

export const NODE_SPEC: NodeSpec = {
  id: "hf-client-transformers-object-detection",
  name: "Object Detection",
  description: "Identify and locate objects of certain defined classes within an image.",

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
      info: "Transformers.js Object Detection model ID",
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
      name: "results",
      type: DataType.OBJECT_DETECTION_RESULT,
      recommendedNodes: [
        {
          nodeSpecId: "bounding_box_visualizer",
          extraInputIdsToConnect: ["image"],
        },
        {
          nodeSpecId: "bounding_box_to_image",
          extraInputIdsToConnect: ["image"],
        },
      ],
    },
  ],
};
