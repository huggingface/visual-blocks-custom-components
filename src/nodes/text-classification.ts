import type { CustomNodeInfo } from '@visualblocks/custom-node-types';
import { PipelineSingleton, BasePipelineNode } from './base';

import {
    COLLECTION_NAME,
} from '../constants';

const NODE_SPEC = {
    'id': 'transformers-text-classification',
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
.container {
    width: 100%;
    height: 100%;
}
`

class TextClassificationNode extends BasePipelineNode {
    constructor() {
        super(TextClassificationPipelineSingleton, TEXT_CLASSIFICATION_NODE_STYLE);
    }


    async runWithInputs(inputs) {
        const { text, option } = inputs;
        if (!text) {  // No input node
            this.dispatchEvent(new CustomEvent('outputs', { detail: { result: null } }));
            return;
        }
        const classifier = await this.instance;

        const result = await classifier(text, { topk: 5 });
        this.root.innerHTML = JSON.stringify(result);

        // Output.
        this.dispatchEvent(new CustomEvent('outputs', { detail: { 'result': result } }));
    }
}

export default { nodeSpec: NODE_SPEC, nodeImpl: TextClassificationNode } as CustomNodeInfo;
