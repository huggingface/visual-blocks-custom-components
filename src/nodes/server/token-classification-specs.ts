import { COLLECTION_NAME_SERVER } from "../../constants";
import { CustomDataTypeEnum } from "../../types";
import type { NodeSpec } from "@visualblocks/custom-node-types";
import {
  DataType,
  Category,
  EditorType,
} from "@visualblocks/custom-node-types";

const DEFAULT_MODEL_ID = "dslim/bert-base-NER";

export const NODE_SPEC: NodeSpec = {
  id: "hf-server-token-classification",
  name: "Token Classification",
  description: "TODO",
  category: Category.PROCESSOR,
  collection: COLLECTION_NAME_SERVER,
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
      type: DataType.STRING,
      defaultValue: DEFAULT_MODEL_ID,
      editorSpec: {
        type: EditorType.TEXT_INPUT,
      },
    },
    {
      name: "apikey",
      displayLabel: "API Key",
      type: DataType.STRING,
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
      type: CustomDataTypeEnum.TOKEN_CLASSIFICATION_RESULT,
      recommendedNodes: [
        {
          nodeSpecId: "hf-client-token-classification-viewer",
        },
      ],
    },
    {
      name: "text",
      type: DataType.STRING,
    },
  ],
};
