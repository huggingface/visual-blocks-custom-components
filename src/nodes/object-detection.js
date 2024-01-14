
import { PipelineSingleton, BasePipelineNode } from './base.js';

import {
    COLLECTION_NAME,
} from '../constants.js';

const NODE_SPEC = {
    'id': 'transformers-object-detection',
    'name': 'Object detection',
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
        'name': 'image',
        'type': 'image',
        "editorSpec": {
            "type": "image_input"
        },
    }],

    // Outputs.
    'outputSpecs': [{
        'name': 'result',
        'type': 'string',
    }],
};

class ObjectDetectionPipelineSingleton extends PipelineSingleton {
    static task = 'object-detection';
    static modelId = 'Xenova/detr-resnet-50';
    static quantized = true;
}

const OBJECT_DETECTION_NODE_STYLE = `
.container {
    position: relative;
}

.container, .image, .boxes, .image > canvas {
    width: 100%;
    height: 100%;
}

.image, .boxes {
    position: absolute;
}

.image {
    z-index: 1;
}

.boxes {
    z-index: 2;
}

.bounding-box {
    position: absolute;
    box-sizing: border-box;
    border: solid 2px;
}

.bounding-box-label {
    color: white;
    position: absolute;
    font-size: 12px;
    margin: -16px 0 0 -2px;
    padding: 1px;
}
`

class ObjectDetectionNode extends BasePipelineNode {
    constructor() {
        super(ObjectDetectionPipelineSingleton, OBJECT_DETECTION_NODE_STYLE);

        this.boxes = document.createElement('div');
        this.boxes.className = 'boxes';
        this.root.appendChild(this.boxes);

        this.image = document.createElement('div');
        this.image.className = 'image';
        this.root.appendChild(this.image);
    }

    // Render a bounding box and label on the image
    renderBox({ box, label }) {
        const { xmax, xmin, ymax, ymin } = box;

        // Generate a random color for the box
        const color = '#' + Math.floor(Math.random() * 0xFFFFFF).toString(16).padStart(6, 0);

        // Draw the box
        const boxElement = document.createElement('div');
        boxElement.className = 'bounding-box';
        Object.assign(boxElement.style, {
            borderColor: color,
            left: 100 * xmin + '%',
            top: 100 * ymin + '%',
            width: 100 * (xmax - xmin) + '%',
            height: 100 * (ymax - ymin) + '%',
        })

        // Draw label
        const labelElement = document.createElement('span');
        labelElement.textContent = label;
        labelElement.className = 'bounding-box-label';
        labelElement.style.backgroundColor = color;

        boxElement.appendChild(labelElement);
        this.boxes.appendChild(boxElement);
    }

    async runWithInputs(inputs, services) {
        const { image, option } = inputs;
        if (!image?.canvasId) {  // No input node
            this.dispatchEvent(new CustomEvent('outputs', { detail: { result: null } }));
            return;
        }

        // Clear boxes
        this.boxes.innerHTML = '';

        const canvas = services.resourceService.get(image.canvasId);
        this.image.appendChild(canvas);
        const data = canvas.toDataURL();

        const detector = await this.instance;

        // Predict segments
        const output = await detector(data, {
            // TODO: Add option for threshold
            // threshold: 0.5,
            percentage: true,
        });

        // Render boxes
        output.forEach((x, i) => this.renderBox(x, i));

        this.dispatchEvent(new CustomEvent('outputs', { detail: { 'result': output } }));
    }
}

export default { nodeSpec: NODE_SPEC, nodeImpl: ObjectDetectionNode };
