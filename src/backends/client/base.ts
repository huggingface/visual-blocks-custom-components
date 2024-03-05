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
  static modelId?: string;
  static quantized = true;

  static instance: Promise<Pipeline>;

  static async getInstance() {
    if (!this.task || !this.modelId) {
      throw new Error("Invalid class configuration");
    }
    if (!this.instance) {
      console.info(
        "Creating pipeline instance. Model not loaded yet, modelId:",
        this.modelId
      );
      this.instance = pipeline(this.task, this.modelId, {
        quantized: this.quantized,
      });
      // TODO: use progress callback
    } else {
      console.info(
        "Pipeline instance already created for modelId:",
        this.modelId
      );
    }
    return this.instance;
  }
}

export class BasePipelineNode extends LitElement {
  singleton: any;
  constructor(singleton: typeof PipelineSingleton) {
    super();
    this.singleton = singleton;
  }

  get instance() {
    return this.singleton.getInstance();
  }

  async runWithInputs(inputs?: {}, services?: Services) {
    throw new Error("Not implemented");
  }
}
