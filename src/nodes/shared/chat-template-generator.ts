import type { RepoDesignation } from "@huggingface/hub";
import { Template } from "@huggingface/jinja";
import type { CustomNodeInfo } from "@visualblocks/custom-node-types";
import { NODE_SPEC } from "./chat-template-generator-specs";

import { compareObjects } from "../../utils";
import { LitElement } from "lit";

declare interface Inputs {
  assistant: string;
  system: string;
  user: string;
  modelid: string;
  add_generation_prompt: boolean;
}

declare interface Outputs {
  template: string;
  modelid: string;
}

class ChatTemplateGenerator extends LitElement {
  private cachedInput?: Inputs;
  private cachedResult?: Outputs;
  private configFile: any;

  constructor() {
    super();
  }

  async downloadFile(params: { repo: RepoDesignation; path: string }) {
    // @ts-ignore
    const hfHUB = await import("https://esm.sh/@huggingface/hub");
    return hfHUB.downloadFile(params);
  }

  async runWithInputs(inputs: Inputs) {
    const { user, assistant, system, modelid, add_generation_prompt } = inputs;

    const _modelid = modelid?.trim();

    if (!user || !_modelid) {
      // No input node
      this.dispatchEvent(
        new CustomEvent("outputs", { detail: { results: null } })
      );
      return;
    }

    if (this.cachedResult && compareObjects(this.cachedInput, inputs)) {
      this.dispatchEvent(
        new CustomEvent("outputs", { detail: this.cachedResult })
      );
      return;
    }

    try {
      if (this.cachedInput?.modelid !== _modelid || !this.configFile) {
        const file = await this.downloadFile({
          repo: _modelid,
          path: "tokenizer_config.json",
        });
        if (file) {
          this.configFile = await file.json();
        } else {
          throw new Error("Failed to download file");
        }
      }
    } catch (error) {
      console.error("Failed to download file", error);
      this.dispatchEvent(
        new CustomEvent("outputs", { detail: { results: null } })
      );
      return;
    }

    const chat = [
      ...(system ? [{ role: "system", content: system }] : []),
      { role: "user", content: user },
      { role: "assistant", content: assistant },
    ];

    try {
      const template = new Template(this.configFile.chat_template);
      const result = template.render({
        add_generation_prompt: add_generation_prompt,
        messages: chat,
        bos_token: this.configFile.bos_token,
        eos_token: this.configFile.eos_token,
      });
      this.cachedInput = inputs;
      this.cachedResult = { template: result, modelid: _modelid };

      this.dispatchEvent(
        new CustomEvent("outputs", {
          detail: this.cachedResult,
        })
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
      return;
    }
  }
}

export default {
  nodeSpec: NODE_SPEC,
  nodeImpl: ChatTemplateGenerator,
} as CustomNodeInfo;
