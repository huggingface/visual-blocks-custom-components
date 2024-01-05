
const NODE_SPEC = {
    'id': 'make-uppercase',
    'name': 'Make uppercase',
    'description': 'Transform the input text to upper case.',

    'category': 'processor',
    'collection': 'Jason Collection',

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


/**
 * Transform the input text to upper case.
 * A minimal example for Visual Blocks custom nodes.
 */
class MakeUppercase extends HTMLElement {
    constructor() {
        super();
    }

    runWithInputs(inputs) {
        // `text` and `option` should match the `name` of this node's
        // input specs and property specs names to destruct object correctly.
        const { text, option } = inputs;

        // Process text - your custom code here.
        const result = option === 'first-letter' ?
            (text.charAt(0).toUpperCase() + text.slice(1)) : text.toUpperCase();

        // Output.
        // `result` in event detail matches the `name` of this node's outputSpec.
        this.dispatchEvent(new CustomEvent('outputs', { detail: { 'result': result } }));
    }
}


// Finally register custom node with visual blocks to start using it.
visualblocks.registerCustomNode({ nodeSpec: NODE_SPEC, nodeImpl: MakeUppercase });
