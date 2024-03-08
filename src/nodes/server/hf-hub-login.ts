import type { OAuthResult } from "@huggingface/hub";
import { NODE_SPEC } from "./hf-hub-login-specs";
import { html, css, LitElement } from "lit";
import { property } from "lit/decorators.js";

interface Inputs {
  apikey: string;
}
// interface Outputs {
//   apikey: string;
// }

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
  .card img {
    max-width: 250px;
  }

  .card p:last-child {
    margin-bottom: 0;
  }
`;
class HFHubLoginNode extends LitElement {
  static styles = STYLES;

  @property()
  oauthResult?: OAuthResult | boolean;
  @property()
  buttonvisible?: boolean = false;

  constructor() {
    super();
    this._handleOAuthFlow();
  }

  render() {
    // The UI rendered here will be projected into its preview panel UI.
    if (this.oauthResult === undefined || this.oauthResult === false) {
      return html`<div class="card">
        <img
          src="https://huggingface.co/datasets/huggingface/badges/resolve/main/sign-in-with-huggingface-xl-dark.svg"
          alt="Sign in with Hugging Face"
          style="cursor: pointer;"
          ${this.buttonvisible ? "" : "hidden"}
          @click="${this._login}"
        />
      </div>`;
    } else if (this.oauthResult && typeof this.oauthResult === "object") {
      return html` <div class="card">
        Hello
        <!-- <img src="${this.oauthResult.userInfo
          .avatarUrl}" alt="User Picture" /> -->
        ${this.oauthResult.userInfo.name}, you are logged in
        <button @click="${this._logout}">Logout</button>
      </div>`;
    }
    return html`<div class="card">Loading...</div>`;
  }
  oauthHandleRedirectIfPresent = async () => {
    // @ts-ignore
    const hfHUB = await import("https://esm.sh/@huggingface/hub");
    return hfHUB.oauthHandleRedirectIfPresent();
  };
  oauthLoginUrl = async (params: { clientId: string; scopes: string }) => {
    // @ts-ignore
    const hfHUB = await import("https://esm.sh/@huggingface/hub");
    return hfHUB.oauthLoginUrl(params);
  };

  async _handleOAuthFlow() {
    const oauthResultStorage = localStorage.getItem("oauth");
    if (oauthResultStorage) {
      try {
        this.oauthResult = JSON.parse(oauthResultStorage);
      } catch {
        this.oauthResult = undefined;
      }
    }

    this.oauthResult ||= await this.oauthHandleRedirectIfPresent();

    if (this.oauthResult && typeof this.oauthResult === "object") {
      localStorage.setItem("oauth", JSON.stringify(this.oauthResult));
      this.dispatchEvent(
        new CustomEvent("outputs", {
          detail: { _apikey: this.oauthResult.accessToken },
        })
      );
    } else {
      this.buttonvisible = true;
    }
  }
  async _login() {
    window.location.href = await this.oauthLoginUrl({
      clientId: "8da93e24-c51a-430b-b8cb-1affa96c1f81",
      scopes: "inference-api",
    });
  }
  async _logout() {
    localStorage.removeItem("oauth");
    this.oauthResult = false;
    this.buttonvisible = true;
    window.location.href = window.location.href.replace(/\?.*$/, "");
    window.location.reload();
  }

  async runWithInputs(inputs: Inputs) {
    const { apikey } = inputs;
    let _apikey: string | undefined;
    if (this.oauthResult && typeof this.oauthResult === "object") {
      _apikey = this.oauthResult?.accessToken;
    }
    if (apikey) {
      _apikey = apikey.trim();
    }
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
