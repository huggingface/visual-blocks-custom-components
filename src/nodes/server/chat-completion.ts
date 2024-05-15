import { HfInference, HfInferenceEndpoint } from "@huggingface/inference";
import type {
  ChatCompletionInput,
  ChatCompletionInputMessage,
} from "@huggingface/tasks";
import { NODE_SPEC } from "./chat-completion-specs";
import { LitElement } from "lit";
import { compareObjects } from "../../utils";

declare interface Inputs extends ChatCompletionInput {
  modelid: string;
  endpointurl: string;
  apikey: string;
  user: string;
  assistant: string;
  system: string;
  stream: boolean;
}
interface Outputs {
  results: string | undefined;
}

class ChatCompletionServerNode extends LitElement {
  private cachedInputs?: Inputs;
  private cachedOutput?: Outputs;
  private hf?: HfInference | HfInferenceEndpoint;
  private controller: AbortController;

  constructor() {
    super();
    this.hf = new HfInference();
    this.controller = new AbortController();
  }

  render() {
    // This node doesn't have a preview UI.
  }
  async runWithInputs(inputs: Inputs) {
    const {
      user,
      assistant,
      system,
      apikey,
      endpointurl,
      modelid,
      frequency_penalty,
      max_tokens,
      temperature,
      stream,
    } = inputs;

    const _modelid = modelid?.trim();
    const _endpointurl = endpointurl?.trim();

    if (this.hf && apikey) {
      this.hf = new HfInference(apikey);
    }
    if (this.hf && endpointurl) {
      this.hf = new HfInferenceEndpoint(_endpointurl, apikey);
    }
    if (this.controller && this.controller.signal) {
      this.controller.abort();
      this.controller = new AbortController();
    }
    if (!user || !_modelid) {
      this.dispatchEvent(
        new CustomEvent("outputs", { detail: { results: null } })
      );
      return;
    }

    if (this.cachedOutput && compareObjects(this.cachedInputs, inputs)) {
      this.dispatchEvent(
        new CustomEvent("outputs", { detail: this.cachedOutput })
      );
      return;
    }

    const messages: ChatCompletionInputMessage[] = [
      ...(system ? [{ role: "system", content: system }] : []),
      ...(user ? [{ role: "user", content: user }] : []),
      ...(assistant ? [{ role: "assistant", content: assistant }] : []),
    ];
    try {
      if (!stream) {
        const textGenerationRes = await this.hf?.chatCompletion(
          {
            model: _modelid,
            messages: messages,
            frequency_penalty: frequency_penalty,
            max_tokens: max_tokens,
            temperature: temperature,
          },
          { signal: this.controller.signal }
        );
        if (!textGenerationRes) {
          throw new Error("Invalid response");
        }

        this.cachedOutput = {
          results: textGenerationRes.choices[0].message?.content,
        };
      } else {
        const textGenerationStream = this.hf?.chatCompletionStream(
          {
            model: _modelid,
            messages: messages,
            frequency_penalty: frequency_penalty,
            max_tokens: max_tokens,
            temperature: temperature,
          },
          { signal: this.controller.signal }
        );
        if (!textGenerationStream) {
          throw new Error("Invalid response");
        }

        let out = "";
        for await (const chunk of textGenerationStream) {
          if (chunk.choices && chunk.choices.length > 0) {
            out += chunk.choices[0].delta.content;
            this.cachedOutput = {
              results: out,
            };
            this.dispatchEvent(
              new CustomEvent("outputs", { detail: this.cachedOutput })
            );
          }
        }
      }

      this.cachedInputs = inputs;
      this.dispatchEvent(
        new CustomEvent("outputs", { detail: this.cachedOutput })
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

export default { nodeSpec: NODE_SPEC, nodeImpl: ChatCompletionServerNode };
