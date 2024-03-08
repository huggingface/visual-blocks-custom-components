import { COLLECTION_NAME } from "../../constants";
import {
  DataType,
  Category,
  EditorType,
} from "@visualblocks/custom-node-types";
import type { NodeSpec } from "@visualblocks/custom-node-types";

const DEFAULT_MODEL_ID = "Xenova/detr-resnet-50";

export const NODE_SPEC: NodeSpec = {
  id: "hf-client-transformers-object-detection",
  name: "Object detection (client)",
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
    {
      name: "modelid",
      displayLabel: "Model ID",
      info: "Transformer.js Image Segmentation model ID",
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
      name: "results",
      type: DataType.OBJECT_DETECTION_RESULT,
      recommendedNodes: [
        {
          nodeSpecId: "bounding_box_visualizer",
          extraInputIdsToConnect: ["image"],
        },
      ],
    },
  ],
};
