export enum CustomDataTypeEnum {
  IMAGE_SEGMENTATION_RESULT = "imageSegmentationResult",
  TOKEN_CLASSIFICATION_RESULT = "tokenClassificationResult",
}

export type TokenClassificationResult = ProcessedTokens[];

export interface ProcessedTokens {
  type: string;
  text: string;
  start?: number;
  end?: number;
}
