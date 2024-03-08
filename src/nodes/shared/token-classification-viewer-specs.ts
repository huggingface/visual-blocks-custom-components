import { COLLECTION_NAME_SHARED } from "../../constants";
import { CustomDataTypeEnum } from "../../types";
import type { NodeSpec } from "@visualblocks/custom-node-types";
import { DataType, Category } from "@visualblocks/custom-node-types";

export const NODE_SPEC: NodeSpec = {
  id: "hf-client-token-classification-viewer",
  name: "Token Classification Viewer",
  description: "TODO",
  category: Category.OUTPUT,
  collection: COLLECTION_NAME_SHARED,

  // Inputs.
  inputSpecs: [
    {
      name: "tokenClassResult",
      type: CustomDataTypeEnum.TOKEN_CLASSIFICATION_RESULT,
      displayLabel: "Token Classification Data",
    },
  ],
  // Outputs.
  outputSpecs: [
    {
      name: "result",
      type: DataType.ANY,
    },
  ],
};
