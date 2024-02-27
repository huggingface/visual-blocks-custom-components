import { HF_HUB_COLLECTION } from "../../constants.js";
import { css, html, LitElement } from "lit";
import { property } from "lit/decorators.js";

import { oauthLoginUrl, oauthHandleRedirectIfPresent } from "@huggingface/hub";

const STYLES = css`
  body {
    padding: 2rem;
    font-family: -apple-system, BlinkMacSystemFont, "Arial", sans-serif;
  }

  h1 {
    font-size: 16px;
    margin-top: 0;
  }

  p {
    color: rgb(107, 114, 128);
    font-size: 15px;
    margin-bottom: 10px;
    margin-top: 5px;
  }

  .card {
    max-width: 620px;
    margin: 0 auto;
    padding: 16px;
    border: 1px solid lightgray;
    border-radius: 16px;
  }

  .card p:last-child {
    margin-bottom: 0;
  }
`;
const NODE_SPEC = {
  id: "hf-hub-login",
  name: "Hugging Face Hub Login",
  description: "TODO",

  category: "input",
  collection: HF_HUB_COLLECTION,
  propertySpecs: [
    {
      name: "apikey",
      displayLabel: "API Key",
      type: "string",
      info: "Type your Hugging Face API Key or click the button to login",
      editorSpec: {
        type: "text_input",
        password: true,
      },
    },
  ],
  inputSpecs: [],
  // Outputs.
  outputSpecs: [
    {
      name: "apikey",
      type: "string",
    },
  ],
};

class HFHubLoginNode extends LitElement {
  static styles = STYLES;

  static properties = {
    oauthResult: { type: Object },
    buttonvisible: { type: Boolean },
  };

  constructor() {
    super();
    this.oauthResult = null;
    this.buttonvisible = false;
  }
  async _handleOAuthFlow() {
    const oauthResult = await oauthHandleRedirectIfPresent();
    if (oauthResult) {
      this.oauthResult = oauthResult;
      console.log("oauthResult", this.oauthResult);
      this.dispatchEvent(
        new CustomEvent("outputs", {
          detail: { _apikey: this.oauthResult?.accessToken },
        })
      );
    } else {
      this.buttonvisible = true;
    }
  }
  async _login() {
    window.location.href = await oauthLoginUrl({
      clientId: "8da93e24-c51a-430b-b8cb-1affa96c1f81",
      scopes: "inference-api",
    });
  }

  connectedCallback() {
    super.connectedCallback();
    this._handleOAuthFlow();
  }

  render() {
    // The UI rendered here will be projected into its preview panel UI.
    return html` <div class="card">
      <h1>OAuth in a static Space</h1>
      <img
        src="https://huggingface.co/datasets/huggingface/badges/resolve/main/sign-in-with-huggingface-xl-dark.svg"
        alt="Sign in with Hugging Face"
        style="cursor: pointer;"
        ${this.buttonvisible ? "" : "hidden"}
        @click="${this._login}"
      />
      <pre>
${JSON.stringify(this.oauthResult, null, 2)}
      </pre
      >
    </div>`;
  }

  async runWithInputs(inputs) {
    const { apikey } = inputs;
    const _apikey = apikey ? apikey.trim() : this.oauthResult?.accessToken;
    if (!_apikey) {
      this.dispatchEvent(
        new CustomEvent("outputs", {
          detail: {
            error: {
              title: "Error",
              message: "No API Key provided",
            },
          },
        })
      );
      return;
    }
    this.dispatchEvent(
      new CustomEvent("outputs", { detail: { apikey: _apikey } })
    );
  }
}

export default { nodeSpec: NODE_SPEC, nodeImpl: HFHubLoginNode };
