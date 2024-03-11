import type { Services } from "@visualblocks/custom-node-types";
import { pipeline, env } from "@xenova/transformers";
import type { Pipeline } from "@xenova/transformers";
import { LitElement } from "lit";

env.backends.onnx.wasm.wasmPaths = 'https://cdn.jsdelivr.net/npm/onnxruntime-web@1.17.1/dist/';
env.backends.onnx.wasm.numThreads = 1;

export type ProgressCallbackFunction = (data: any) => void;

/**
 * @abstract
 */
export class PipelineSingleton {
  static task?: any;

  static instance: { [key: string]: Promise<Pipeline> } = {};

  static async getInstance(modelId: string, quantized: boolean, progress_callback?: ProgressCallbackFunction) {
    if (!this.task) {
      throw new Error("Invalid class configuration");
    }
    const key = `${modelId}${quantized ? "_quantized" : ""}`;
    if (!(key in this.instance)) {
      console.info(
        "Creating pipeline instance. Model not loaded yet, modelId:",
        modelId
      );
      this.instance[key] = pipeline(this.task, modelId, {
        quantized,
        progress_callback,
        device: "webgpu",
      });
      // TODO: use progress callback
    } else {
      console.info("Pipeline instance already created for modelId:", modelId);
    }
    return this.instance[key];
  }
}

export class BasePipelineNode extends LitElement {
  singleton: any;
  constructor(singleton: any) {
    super();
    this.singleton = singleton;
  }

  getInstance(modelId: string, quantized: boolean, progress_callback?: ProgressCallbackFunction) {
    return this.singleton.getInstance(modelId, quantized, progress_callback);
  }

  async runWithInputs(inputs?: {}, services?: Services) {
    throw new Error("Not implemented");
  }
}
