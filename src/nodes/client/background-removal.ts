import type {
  CustomNodeInfo,
  Services,
  VisualBlocksImage,
} from "@visualblocks/custom-node-types";

import { AutoModel, AutoProcessor, RawImage } from "@xenova/transformers";

import {
  BasePipelineNode,
  Devices,
  type DevicesType,
} from "../../backends/client/base";

import type { ProgressCallbackFunction } from "../../backends/client/base";

import { NODE_SPEC } from "./background-removal-spec";
import { compareObjects } from "../../utils";

declare interface Inputs {
  image: VisualBlocksImage;
  quantized: boolean;
  modelid: string;
  device: DevicesType;
}
declare interface Outputs {
  foreground: VisualBlocksImage;
}

export class ModelSingleton {
  static task?: any;
  static instance: { [key: string]: Promise<AutoModel> } = {};

  static async getInstance(
    modelId: string,
    quantized: boolean,
    device: DevicesType,
    progress_callback?: ProgressCallbackFunction
  ) {
    const revision = modelId.split("@")[1] || "main";
    modelId = modelId.split("@")[0];
    const key = `${modelId}${
      quantized ? "_quantized" : ""
    }_${device}_${revision}`;
    if (!(key in this.instance)) {
      console.info(
        "Creating model instance. Model not loaded yet, modelId:",
        modelId,
        "Device",
        device
      );
      const model = AutoModel.from_pretrained(modelId, {
        // Do not require config.json to be present in the repository
        quantized: device === Devices.webgpu ? false : quantized,
        device: device,
        revision: revision,
      });
      const processor = await AutoProcessor.from_pretrained(modelId, {
        revision: revision,
      });
      this.instance[key] = Promise.all([model, processor]);

      // TODO: use progress callback
    } else {
      console.info(
        "Model instance already created for modelId:",
        modelId,
        "Device",
        device
      );
    }
    return this.instance[key];
  }
}

class BackgroundRemovalNode extends BasePipelineNode {
  private cachedInput?: Inputs;
  private cachedResult?: VisualBlocksImage;

  constructor() {
    super(ModelSingleton);
  }
  render() {}

  async runWithInputs(inputs: Inputs, services: Services) {
    const { image, modelid, quantized, device } = inputs;

    const _modelid = modelid?.trim();

    if (!image?.canvasId) {
      // No input node
      this.dispatchEvent(
        new CustomEvent("outputs", { detail: { foreground: null } })
      );
      return;
    }

    if (this.cachedResult && compareObjects(this.cachedInput, inputs)) {
      this.dispatchEvent(
        new CustomEvent("outputs", {
          detail: { foreground: this.cachedResult },
        })
      );
      return;
    }
    this.cachedInput = inputs;

    // Clear masks
    // this.masks.innerHTML = '';

    const canvas = services.resourceService.get(
      image.canvasId
    ) as HTMLCanvasElement;
    const data = canvas.toDataURL();
    const [model, processor] = await this.getInstance(
      _modelid,
      quantized,
      device
    );

    // TODO: .fromCanvas() method
    const i = await RawImage.fromURL(data);

    // Preprocess image
    const { pixel_values } = await processor(i);

    // Predict alpha matte
    const { output } = await model({ input: pixel_values });

    // Resize mask back to original size
    const mask = await RawImage.fromTensor(
      output[0].mul(255).to("uint8")
    ).resize(i.width, i.height);

    // Create new canvas
    const c = document.createElement("canvas");
    c.width = i.width;
    c.height = i.height;
    const ctx = c.getContext("2d")!;

    // Draw original image output to canvas
    ctx.drawImage(i.toCanvas(), 0, 0);

    // Update alpha channel
    const pixelData = ctx.getImageData(0, 0, i.width, i.height);
    for (let i = 0; i < mask.data.length; ++i) {
      pixelData.data[4 * i + 3] = mask.data[i];
    }
    ctx.putImageData(pixelData, 0, 0);

    const out = {
      canvasId: services.resourceService.put(c),
    };

    const detail: Outputs = { foreground: out };
    this.cachedResult = out;

    this.dispatchEvent(new CustomEvent("outputs", { detail: detail }));
  }
}

export default {
  nodeSpec: NODE_SPEC,
  nodeImpl: BackgroundRemovalNode,
} as CustomNodeInfo;
