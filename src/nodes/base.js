import { pipeline, env } from '@xenova/transformers';

// Disable local model check
env.allowLocalModels = false;

/**
 * @abstract
 */
export class PipelineSingleton {
    static task;
    static modelId;
    static quantized = true;

    static instance;
    static async getInstance() {
        if (!this.task || !this.modelId) {
            throw new Error("Invalid class configuration");
        }
        if (!this.instance) {
            this.instance = pipeline(this.task, this.modelId, {
                quantized: this.quantized,
            });
            // TODO: use progress callback
        }
        return this.instance;
    }
}

export class BasePipelineNode extends HTMLElement {
    constructor(singleton, styles) {
        super();
        this.singleton = singleton;

        this.attachShadow({ mode: 'open' });
        const style = document.createElement('style');
        style.textContent = styles;
        this.shadowRoot.appendChild(style);

        this.root = document.createElement('div');
        this.root.className = 'container';
        this.shadowRoot.appendChild(this.root);
    }

    get instance() {
        return this.singleton.getInstance();
    }

    async runWithInputs(inputs) {
        throw new Error("Not implemented");
    }
}
