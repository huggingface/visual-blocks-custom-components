import "@visualblocks/custom-node-types";

/**
 * Registry containing the definitions of the custom components.
 */

// import TOKEN_CLASSIFICATION_NODE from "./nodes/client/token-classification";
import IMAGE_SEGMENTATION_NODE from "./nodes/client/image-segmentation";
import IMAGE_SEGMENTATION_VIEWER_NODE from "./nodes/client/image-segmentation-viewer";
import TEXT_CLASSIFICATION_NODE from "./nodes/client/text-classification";
import TEXT2TEXT_GENERATION_NODE from "./nodes/client/translation";
import OBJECT_DETECTION_GENERATION_NODE from "./nodes/client/object-detection";

// Register custom nodes with visual blocks to start using them.
// visualblocks.registerCustomNode(TOKEN_CLASSIFICATION_NODE);
visualblocks.registerCustomNode(TEXT_CLASSIFICATION_NODE);
visualblocks.registerCustomNode(IMAGE_SEGMENTATION_NODE);
visualblocks.registerCustomNode(IMAGE_SEGMENTATION_VIEWER_NODE);
visualblocks.registerCustomNode(TEXT2TEXT_GENERATION_NODE);
visualblocks.registerCustomNode(OBJECT_DETECTION_GENERATION_NODE);
