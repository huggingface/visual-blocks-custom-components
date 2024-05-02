import { Devices, type DevicesType } from "./backends/client/base";

export enum CustomDataTypeEnum {
  IMAGE_SEGMENTATION_RESULT = "imageSegmentationResult",
  TOKEN_CLASSIFICATION_RESULT = "tokenClassificationResult",
  DEPTH_ESTIMATION_RESULT = "depthEstimationResult",
  DEVICES = "devices",
  HF_TOKEN = "hf_Token",
}
export { Devices, DevicesType };

export type TokenClassificationResult = ProcessedTokens[];

export interface ProcessedTokens {
  type: string;
  text: string;
  start?: number;
  end?: number;
}
