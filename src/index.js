/**
 * Registry containing the definitions of the custom components.
 */

import TEXT_CLASSIFICATION_NODE from './nodes/text-classification.js';
import IMAGE_SEGMENTATION_NODE from './nodes/image-segmentation.js';
import TEXT2TEXT_GENERATION_NODE from './nodes/translation.js';

// Register custom nodes with visual blocks to start using them.
visualblocks.registerCustomNode(TEXT_CLASSIFICATION_NODE);
visualblocks.registerCustomNode(IMAGE_SEGMENTATION_NODE);
visualblocks.registerCustomNode(TEXT2TEXT_GENERATION_NODE);
