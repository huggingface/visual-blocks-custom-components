
import { PipelineSingleton, BasePipelineNode } from './base.js';

import {
    COLLECTION_NAME,
} from '../constants.js';

const NODE_SPEC = {
    'id': 'transformers-translation',
    'name': 'Translation',
    'description': 'TODO',

    'category': 'processor',
    'collection': COLLECTION_NAME,

    // Properties.
    "propertySpecs": [
        {
            "name": "language",
            "type": "string",
            "editorSpec": {
                "type": "dropdown",
                "options": [
                    {
                        "value": "French",
                        "label": "French"
                    },
                    {
                        "value": "German",
                        "label": "German"
                    },
                    {
                        "value": "Romanian",
                        "label": "Romanian"
                    }
                ]
            }
        }
    ],

    // Inputs.
    'inputSpecs': [{
        'name': 'text',
        'type': 'string',
        "editorSpec": {
            "type": "text_input"
        },
    }],

    // Outputs.
    'outputSpecs': [{
        'name': 'result',
        'type': 'string',
    }],
};

class Text2TextPipelineSingleton extends PipelineSingleton {
    static task = 'text2text-generation';
    static modelId = 'Xenova/t5-small';
    static quantized = true;
}

const TEXT2TEXT_GENERATION_NODE_STYLE = `
.container {
    width: 100%;
    height: 100%;
}
`

class Text2TextGenerationNode extends BasePipelineNode {
    constructor() {
        super(Text2TextPipelineSingleton, TEXT2TEXT_GENERATION_NODE_STYLE);
    }


    async runWithInputs(inputs) {
        const { text, language } = inputs;
        if (!text) {  // No input node
            this.dispatchEvent(new CustomEvent('outputs', { detail: { result: null } }));
            return;
        }
        const translator = await this.instance;

        const prompt = `translate English to ${language}: ${text}`;
        const result = await translator(prompt);
        this.root.innerHTML = JSON.stringify(result);

        // Output.
        this.dispatchEvent(new CustomEvent('outputs', { detail: { 'result': result[0].generated_text } }));
    }
}

export default { nodeSpec: NODE_SPEC, nodeImpl: Text2TextGenerationNode };
