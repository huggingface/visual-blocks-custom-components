import { COLLECTION_NAME_SERVER, CURATED_MODELS } from "../../constants";
import { CustomDataTypeEnum } from "../../types";
import type { NodeSpec } from "@visualblocks/custom-node-types";
import {
  DataType,
  Category,
  EditorType,
} from "@visualblocks/custom-node-types";

export const NODE_SPEC: NodeSpec = {
  id: "hf-server-transformers-text-classification",
  name: "Text Classification",
  description: "TODO",

  category: Category.PROCESSOR,
  collection: COLLECTION_NAME_SERVER,

  // Properties.
  propertySpecs: [],

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
      info: "Curated models from Hugging Face or input your own model ID",
      type: DataType.STRING,
      editorSpec: {
        type: EditorType.DROPDOWN,
        options: CURATED_MODELS.text_classification,
      },
    },
    {
      name: "apikey",
      displayLabel: "API Key",
      type: CustomDataTypeEnum.HF_TOKEN,
      editorSpec: {
        type: EditorType.TEXT_INPUT,
        password: true,
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
