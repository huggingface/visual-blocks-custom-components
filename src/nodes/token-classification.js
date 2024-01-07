
import { PipelineSingleton, BasePipelineNode } from './base.js';

import {
    COLLECTION_NAME,
} from '../constants.js';

const NODE_SPEC = {
    'id': 'transformers-token-classification',
    'name': 'Token Classification',
    'description': 'TODO',

    'category': 'processor',
    'collection': COLLECTION_NAME,

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

class TokenClassificationPipelineSingleton extends PipelineSingleton {
    static task = 'token-classification';
    static modelId = 'Xenova/bert-base-multilingual-cased-ner-hrl';
    static quantized = true;
}

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
  padding-left: 0.25rem;
  padding-right: 0.25rem;
}

.ner-tag {
  font-size: 0.75rem;
  padding-left: 0.125rem;
  padding-right: 0.125rem;
  margin-left: 0.125rem;
}
`

const NER_TAGS = {
    // tag: [textColour, backgroundColour, tagColour]
    'ORG': ['#115E59', '#CCFBF1', '#14B8A6'],
    'PER': ['#9D174D', '#FCE7F3', '#EC4899'],
    'LOC': ['#86198F', '#FAE8FF', '#D946EF'],
}


class TokenClassificationNode extends BasePipelineNode {
    constructor() {
        super(TokenClassificationPipelineSingleton, TOKEN_CLASSIFICATION_NODE_STYLE);
    }

    postProcess(tokenizer, outputs) {

        const chunks = [];
        let currentChunk = { type: '', text: [] };

        for (let i = 0; i < outputs.length; i++) {
            const word = tokenizer.model.tokens_to_ids.get(outputs[i].word);
            const entity = outputs[i].entity;

            if (entity.startsWith('B-')) { // beginning of a new chunk
                if (currentChunk.text.length > 0) { // push the current chunk if it exists
                    chunks.push(currentChunk);
                    currentChunk = { type: '', text: [] };
                }
                currentChunk.type = entity.slice(2); // get the type of the chunk
                currentChunk.text = [word];
            } else if (entity.startsWith('I-')) { // continuation of a chunk
                currentChunk.text.push(word);
            } else { // not part of a chunk (O tag)
                if (currentChunk.text.length > 0) { // push the current chunk if it exists

                    if (currentChunk.type === 'O') {
                        currentChunk.text.push(word);
                    } else {
                        chunks.push(currentChunk);
                        currentChunk = { type: 'O', text: [word] };
                    }
                } else {
                    currentChunk = { type: 'O', text: [word] };
                }
            }
        }

        // push the last chunk if it exists
        if (currentChunk.text.length > 0) {
            chunks.push(currentChunk);
        }

        return chunks.map(x => ({
            type: x.type,
            text: tokenizer.decode(x.text),
        }))
    }

    async runWithInputs(inputs) {
        const { text, option } = inputs;
        if (!text) {  // No input node
            this.dispatchEvent(new CustomEvent('outputs', { detail: { result: null } }));
            return;
        }
        const classifier = await this.instance;

        const result = await classifier(text, {
            ignore_labels: [], // Return all labels
        });


        this.root.innerHTML = '';
        const tokens = this.postProcess(classifier.tokenizer, result);

        for (const token of tokens) {
            let elem;
            if (token.type === 'O') {
                elem = document.createTextNode(token.text);
            } else {
                const [textColour, backgroundColour, tagColour] = NER_TAGS[token.type];

                const container = document.createElement('span');
                container.textContent = token.text;
                container.className = 'ner-container';
                container.style.backgroundColor = backgroundColour;
                container.style.color = textColour;

                const tag = document.createElement('span');
                tag.className = 'ner-tag';
                tag.textContent = token.type;
                tag.style.backgroundColor = tagColour;
                tag.style.color = backgroundColour;

                container.appendChild(tag);

                elem = container;
            }
            this.root.appendChild(elem);
        }

        this.dispatchEvent(new CustomEvent('outputs', { detail: { 'result': result } }));
    }
}

export default { nodeSpec: NODE_SPEC, nodeImpl: TokenClassificationNode };
