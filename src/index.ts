/**
 * Registry containing the definitions of the custom components.
 */

import TOKEN_CLASSIFICATION_NODE from "./nodes/client/token-classification";
import TOKEN_CLASSIFICATION_VIEWER_NODE from "./nodes/client/token-classification-viewer";
import IMAGE_SEGMENTATION_NODE from "./nodes/client/image-segmentation";
import IMAGE_SEGMENTATION_VIEWER_NODE from "./nodes/client/image-segmentation-viewer";
import TEXT_CLASSIFICATION_NODE from "./nodes/client/text-classification";
import TEXT2TEXT_GENERATION_NODE from "./nodes/client/translation";
import OBJECT_DETECTION_GENERATION_NODE from "./nodes/client/object-detection";

import TEXT_CLASSIFICATION_SERVER_NODE from "./nodes/server/text-classification";
import TEXT_TO_IMAGE_SERVER_NODE from "./nodes/server/text-to-image";
import HF_LOGIN_HUB from "./nodes/server/hf-hub-login";
//
const client_node = [
  TOKEN_CLASSIFICATION_NODE,
  TOKEN_CLASSIFICATION_VIEWER_NODE,
  IMAGE_SEGMENTATION_NODE,
  IMAGE_SEGMENTATION_VIEWER_NODE,
  TEXT_CLASSIFICATION_NODE,
  TEXT2TEXT_GENERATION_NODE,
  OBJECT_DETECTION_GENERATION_NODE,
];
const server_nodes = [
  TEXT_CLASSIFICATION_SERVER_NODE,
  TEXT_TO_IMAGE_SERVER_NODE,
  HF_LOGIN_HUB,
];

// Register client nodes custom nodes with visual blocks to start using them.
client_node.forEach((node) => {
  visualblocks.registerCustomNode(node);
});
server_nodes.forEach((node) => {
  visualblocks.registerCustomNode(node);
});
