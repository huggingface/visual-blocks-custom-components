/**
 * Registry containing the definitions of the custom components.
 */

import TOKEN_CLASSIFICATION_VIEWER_NODE from "./nodes/shared/token-classification-viewer";
import IMAGE_SEGMENTATION_VIEWER_NODE from "./nodes/shared/image-segmentation-viewer";
import DEPTH_ESTIMATION_VIEWER_NODE from "./nodes/shared/depth-estimation-viewer";

import TOKEN_CLASSIFICATION_NODE from "./nodes/client/token-classification";
import IMAGE_SEGMENTATION_NODE from "./nodes/client/image-segmentation";
import TEXT_CLASSIFICATION_NODE from "./nodes/client/text-classification";
import IMAGE_CLASSIFICATION_NODE from "./nodes/client/image-classification";
import TEXT2TEXT_GENERATION_NODE from "./nodes/client/translation";
import DEPTH_ESTIMATION_NODE from "./nodes/client/depth-estimation";
import OBJECT_DETECTION_GENERATION_NODE from "./nodes/client/object-detection";
import BACKGROUND_REMOVAL_NODE from "./nodes/client/background-removal";

import TEXT_CLASSIFICATION_SERVER_NODE from "./nodes/server/text-classification";
import TEXT_TO_IMAGE_SERVER_NODE from "./nodes/server/text-to-image";
import TOKEN_CLASSIFICATION_SERVER_NODE from "./nodes/server/token-classification";
import FILL_MASK_SERVER_NODE from "./nodes/server/fill-mask";
import SUMMARIZATION_SERVER from "./nodes/server/summarization";
import IMAGE_CLASSIFICATION_SERVER_NODE from "./nodes/server/image-classification";

import HF_LOGIN_HUB from "./nodes/server/hf-hub-login";
//
const client_node = [
  TOKEN_CLASSIFICATION_NODE,
  TOKEN_CLASSIFICATION_VIEWER_NODE,
  IMAGE_SEGMENTATION_NODE,
  IMAGE_SEGMENTATION_VIEWER_NODE,
  DEPTH_ESTIMATION_VIEWER_NODE,
  TEXT_CLASSIFICATION_NODE,
  IMAGE_CLASSIFICATION_NODE,
  TEXT2TEXT_GENERATION_NODE,
  DEPTH_ESTIMATION_NODE,
  OBJECT_DETECTION_GENERATION_NODE,
  BACKGROUND_REMOVAL_NODE,
];
const server_nodes = [
  TEXT_CLASSIFICATION_SERVER_NODE,
  TEXT_TO_IMAGE_SERVER_NODE,
  HF_LOGIN_HUB,
  TOKEN_CLASSIFICATION_SERVER_NODE,
  SUMMARIZATION_SERVER,
  FILL_MASK_SERVER_NODE,
  IMAGE_CLASSIFICATION_SERVER_NODE,
];

// Register client nodes custom nodes with visual blocks to start using them.
client_node.forEach((node) => {
  visualblocks.registerCustomNode(node);
});
server_nodes.forEach((node) => {
  visualblocks.registerCustomNode(node);
});
