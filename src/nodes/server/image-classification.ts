import type {
  CustomNodeInfo,
  Services,
  VisualBlocksImage,
  VisualBlocksClassificationResult,
} from "@visualblocks/custom-node-types";
import { NODE_SPEC } from "./image-classification-specs";
import { compareObjects } from "../../utils";
import { LitElement } from "lit";
import { HfInference } from "@huggingface/inference";

interface Inputs {
  image: VisualBlocksImage;
  modelid: string;
  apikey: string;
}
interface Outputs {
  results: VisualBlocksClassificationResult;
}

class ImageClassificationNode extends LitElement {
  private cachedInputs?: Inputs;
  private cachedResult?: Outputs;
  private hf?: HfInference;

  constructor() {
    super();
    this.hf = new HfInference();
  }

  render() {
    // This node doesn't have a preview UI.
  }
  async runWithInputs(inputs: Inputs, services: Services) {
    const { image, apikey, modelid } = inputs;

    const _modelid = modelid?.trim();

    if (this.hf && apikey) {
      this.hf = new HfInference(apikey);
    }

    if (!image) {
      this.dispatchEvent(
        new CustomEvent("outputs", { detail: { results: null } })
      );
      return;
    }

    if (this.cachedResult && compareObjects(this.cachedInputs, inputs)) {
      this.dispatchEvent(
        new CustomEvent("outputs", { detail: this.cachedResult })
      );
      return;
    }
    const canvas = services.resourceService.get(
      image.canvasId
    ) as HTMLCanvasElement;
    const canvasBlob = await new Promise<Blob | null>((resolve) => {
      canvas.toBlob((blob) => {
        resolve(blob);
      });
    });
    if (!canvasBlob) {
      this.dispatchEvent(
        new CustomEvent("outputs", {
          detail: {
            error: {
              title: "Error",
              message: "Invalid canvas",
            },
          },
        })
      );
      return;
    }

    try {
      const imageClassRes = await this.hf?.imageClassification({
        model: _modelid,
        data: canvasBlob,
      });
      if (!imageClassRes) {
        throw new Error("Invalid response");
      }

      const classProb = imageClassRes.map((e) => ({
        className: e.label,
        probability: e.score,
      }));

      this.cachedInputs = inputs;
      this.cachedResult = {
        results: { classes: classProb },
      };

      this.dispatchEvent(
        new CustomEvent("outputs", { detail: this.cachedResult })
      );
    } catch (error: any) {
      this.dispatchEvent(
        new CustomEvent("outputs", {
          detail: {
            error: {
              title: "Error",
              message: error.message,
            },
          },
        })
      );
    }
  }
}

export default {
  nodeSpec: NODE_SPEC,
  nodeImpl: ImageClassificationNode,
} as CustomNodeInfo;
