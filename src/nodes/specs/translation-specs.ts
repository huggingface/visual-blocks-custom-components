import { COLLECTION_NAME } from "../../constants";
import type { NodeSpec } from "@visualblocks/custom-node-types";
import {
  DataType,
  Category,
  EditorType,
} from "@visualblocks/custom-node-types";

export const NODE_SPEC: NodeSpec = {
  id: "hf-client-transformers-translation",
  name: "Translation (client)",
  description: "TODO",

  category: Category.PROCESSOR,
  collection: COLLECTION_NAME,

  // Properties.
  propertySpecs: [
    {
      name: "language",
      type: DataType.STRING,
      editorSpec: {
        type: EditorType.DROPDOWN,
        options: [
          {
            value: "French",
            label: "French",
          },
          {
            value: "German",
            label: "German",
          },
          {
            value: "Romanian",
            label: "Romanian",
          },
        ],
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
  ],

  // Outputs.
  outputSpecs: [
    {
      name: "result",
      type: DataType.STRING,
    },
    {
      name: "text",
      type: DataType.STRING,
    },
  ],
};
