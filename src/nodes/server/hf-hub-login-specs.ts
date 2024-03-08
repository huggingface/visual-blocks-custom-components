import { COLLECTION_NAME_SERVER } from "../../constants";
import type { NodeSpec } from "@visualblocks/custom-node-types";
import {
  DataType,
  Category,
  EditorType,
} from "@visualblocks/custom-node-types";

export const NODE_SPEC: NodeSpec = {
  id: "hf-hub-login",
  name: "Hugging Face Hub Login",
  description:
    "Authenticate with Hugging Face Hub to easily access your API key and get better rate limits.",

  category: Category.INPUT,
  collection: COLLECTION_NAME_SERVER,

  propertySpecs: [
    {
      name: "apikey",
      displayLabel: "API Key",
      type: DataType.STRING,
      info: "Type your Hugging Face API Key or click the button to login",
      editorSpec: {
        type: EditorType.TEXT_INPUT,
        password: true,
      },
    },
    {
      name: "hidePreview",
      displayLabel: "Hide preview",
      type: DataType.BOOLEAN,
      editorSpec: {
        type: EditorType.SLIDE_TOGGLE,
      },
    },
  ],
  inputSpecs: [],
  // Outputs.
  outputSpecs: [
    {
      name: "apikey",
      type: DataType.STRING,
    },
  ],
};
