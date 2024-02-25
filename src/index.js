/**
 * Registry containing the definitions of the custom components.
 */
import nodes from "./nodes/huggingface-hub/index.js";
import TEXT_CLASSIFICATION_NODE from "./nodes/text-classification.js";
import TOKEN_CLASSIFICATION_NODE from "./nodes/token-classification.js";
import IMAGE_SEGMENTATION_NODE from "./nodes/image-segmentation.js";
import TEXT2TEXT_GENERATION_NODE from "./nodes/translation.js";
import OBJECT_DETECTION_GENERATION_NODE from "./nodes/object-detection.js";

// Register custom nodes with visual blocks to start using them.
visualblocks.registerCustomNode(TEXT_CLASSIFICATION_NODE);
visualblocks.registerCustomNode(TOKEN_CLASSIFICATION_NODE);
visualblocks.registerCustomNode(IMAGE_SEGMENTATION_NODE);
visualblocks.registerCustomNode(TEXT2TEXT_GENERATION_NODE);
visualblocks.registerCustomNode(OBJECT_DETECTION_GENERATION_NODE);

// register huggingface hub nodes
for (const node of nodes) {
  visualblocks.registerCustomNode(node);
}
