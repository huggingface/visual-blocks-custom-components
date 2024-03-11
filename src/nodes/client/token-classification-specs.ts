import { COLLECTION_NAME_CLIENT } from "../../constants";
import { CustomDataTypeEnum } from "../../types";
import type { NodeSpec } from "@visualblocks/custom-node-types";
import {
  DataType,
  Category,
  EditorType,
} from "@visualblocks/custom-node-types";

const DEFAULT_MODEL_ID = "Xenova/bert-base-multilingual-cased-ner-hrl";

export const NODE_SPEC: NodeSpec = {
  id: "hf-client-token-classification",
  name: "Token Classification",
  description: "Assigning a label to each token in a text.",
  category: Category.PROCESSOR,
  collection: COLLECTION_NAME_CLIENT,

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
      info: "Transformers.js Token Classification model ID",
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
      type: CustomDataTypeEnum.TOKEN_CLASSIFICATION_RESULT,
      recommendedNodes: [
        {
          nodeSpecId: "hf-token-classification-viewer",
        },
      ],
    },
    {
      name: "text",
      type: DataType.STRING,
    },
  ],
};
