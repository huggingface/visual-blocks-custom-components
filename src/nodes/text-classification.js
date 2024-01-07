
import { PipelineSingleton, BasePipelineNode } from './base.js';

import {
    COLLECTION_NAME,
} from '../constants.js';

const NODE_SPEC = {
    'id': 'text-classification',
    'name': 'Text Classification',
    'description': 'TODO',

    'category': 'processor',
    'collection': COLLECTION_NAME,

    // Properties.
    "propertySpecs": [
        {
            "name": "option",
            "type": "string",
            "editorSpec": {
                "type": "dropdown",
                "options": [
                    {
                        "value": "first-letter",
                        "label": "First letter only"
                    },
                    {
                        "value": "all-letters",
                        "label": "All letters"
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

class TextClassificationPipelineSingleton extends PipelineSingleton {
    static task = 'text-classification';
    static modelId = 'Xenova/distilbert-base-uncased-finetuned-sst-2-english';
    static quantized = true;
}

const TEXT_CLASSIFICATION_NODE_STYLE = `
* {
    width: 100%;
    height: 200px;
    background-color: red;
}
`

class TextClassificationNode extends BasePipelineNode {
    constructor() {
        super(TextClassificationPipelineSingleton, TEXT_CLASSIFICATION_NODE_STYLE);
    }


    async runWithInputs(inputs) {
        const { text, option } = inputs;
        if (!text) return; // No input node

        const classifier = await this.instance;

        const result = await classifier(text, { topk: 5 });
        this.root.innerHTML = JSON.stringify(result);

        // Output.
        this.dispatchEvent(new CustomEvent('outputs', { detail: { 'result': result } }));
    }
}

export default { nodeSpec: NODE_SPEC, nodeImpl: TextClassificationNode };
