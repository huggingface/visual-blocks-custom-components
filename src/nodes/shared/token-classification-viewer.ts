import type { CustomNodeInfo } from "@visualblocks/custom-node-types";
import { html, LitElement } from "lit";
import { property } from "lit/decorators.js";
import { NODE_SPEC } from "./token-classification-viewer-specs";
import type { TokenClassificationResult, ProcessedTokens } from "../../types";

const TOKEN_CLASSIFICATION_NODE_STYLE = `
.container {
    color: #4B5563;
    line-height: 1.25rem;
    padding: 0.75rem;
}

.ner-container,
.ner-tag {
  border-radius: 0.25rem;
  font-weight: 600;
}

.ner-container {
  margin-right: 0.25rem;
  margin-left: 0.25rem;
}

.ner-tag {
  font-size: 0.75rem;
  padding-left: 0.125rem;
  padding-right: 0.125rem;
  margin-left: 0.125rem;
}
`;

declare interface Inputs {
  tokenClassResult: {
    tokens: TokenClassificationResult;
  };
}

const NER_TAGS: Record<string, string[]> = {
  // tag: [textColour, backgroundColour, tagColour]
  ORG: ["#115E59", "#CCFBF1", "#14B8A6"],
  PER: ["#9D174D", "#FCE7F3", "#EC4899"],
  LOC: ["#86198F", "#FAE8FF", "#D946EF"],
};

class TokenClassificationViwerNode extends LitElement {
  @property()
  tokens: TokenClassificationResult = [];

  constructor() {
    super();
  }
  render() {
    if (!this.tokens) {
      return html`<div class="container">No tokens</div>`;
    }
    return html`<div class="container">
      <div>
        ${this.processTokens(this.tokens)}
        <style>
          ${TOKEN_CLASSIFICATION_NODE_STYLE}
        </style>
      </div>
    </div>`;
  }

  processTokens(tokens: ProcessedTokens[]) {
    const elements = [];
    for (const token of tokens) {
      let elem;
      if (token.type === "O") {
        elem = html`${token.text}`;
      } else {
        const [textColour, backgroundColour, tagColour] = NER_TAGS[token.type];
        elem = html`<span
          class="ner-container"
          style="background-color: ${backgroundColour}; color: ${textColour}"
        >
          ${token.text}
          <span
            title="${token.type}"
            class="ner-tag"
            style="background-color: ${tagColour}; color: ${backgroundColour}"
          >
            ${token.type}
          </span>
        </span>`;
      }
      elements.push(elem);
    }
    return elements;
  }

  async runWithInputs(inputs: Inputs) {
    const { tokenClassResult } = inputs;

    this.tokens = tokenClassResult.tokens;

    this.dispatchEvent(
      new CustomEvent("outputs", {
        detail: { results: this.tokens },
      })
    );
  }
}

export default {
  nodeSpec: NODE_SPEC,
  nodeImpl: TokenClassificationViwerNode,
} as CustomNodeInfo;
