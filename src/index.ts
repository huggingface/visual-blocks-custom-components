import '@visualblocks/custom-node-types';

/**
 * Registry containing the definitions of the custom components.
 */

import TEXT_CLASSIFICATION_NODE from './nodes/text-classification';
import TOKEN_CLASSIFICATION_NODE from './nodes/token-classification';
import IMAGE_SEGMENTATION_NODE from './nodes/image-segmentation';
import TEXT2TEXT_GENERATION_NODE from './nodes/translation';
import OBJECT_DETECTION_GENERATION_NODE from './nodes/object-detection';

// Register custom nodes with visual blocks to start using them.
visualblocks.registerCustomNode(TEXT_CLASSIFICATION_NODE);
visualblocks.registerCustomNode(TOKEN_CLASSIFICATION_NODE);
visualblocks.registerCustomNode(IMAGE_SEGMENTATION_NODE);
visualblocks.registerCustomNode(TEXT2TEXT_GENERATION_NODE);
visualblocks.registerCustomNode(OBJECT_DETECTION_GENERATION_NODE);
