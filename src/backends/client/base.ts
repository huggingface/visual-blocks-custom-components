import type { Services } from "@visualblocks/custom-node-types";
import { pipeline, env } from "@xenova/transformers";
import type { Pipeline } from "@xenova/transformers";
import { LitElement } from "lit";

// Disable local model check
env.allowLocalModels = false;

// Proxy execution to a web worker to avoid freezing the UI
env.backends.onnx.wasm.proxy = true;

/**
 * @abstract
 */
export class PipelineSingleton {
  static task?: any;

  static instance: { [key: string]: Promise<Pipeline> } = {};

  static async getInstance(modelId: string, quantized: boolean) {
    if (!this.task) {
      throw new Error("Invalid class configuration");
    }
    if (!(modelId in this.instance)) {
      console.info(
        "Creating pipeline instance. Model not loaded yet, modelId:",
        modelId
      );
      this.instance[modelId] = pipeline(this.task, modelId, {
        quantized: quantized,
      });
      // TODO: use progress callback
    } else {
      console.info("Pipeline instance already created for modelId:", modelId);
    }
    return this.instance[modelId];
  }
}

export class BasePipelineNode extends LitElement {
  singleton: any;
  constructor(singleton: typeof PipelineSingleton) {
    super();
    this.singleton = singleton;
  }

  getInstance(modelId: string, quantized: boolean) {
    return this.singleton.getInstance(modelId, quantized);
  }

  async runWithInputs(inputs?: {}, services?: Services) {
    throw new Error("Not implemented");
  }
}
