
import { PipelineSingleton, BasePipelineNode } from './base.js';

import {
    COLLECTION_NAME,
} from '../constants.js';

import { clamp } from '../utils.js';

const NODE_SPEC = {
    'id': 'transformers-image-segmentation',
    'name': 'Image segmentation',
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

class ImageSegmentationPipelineSingleton extends PipelineSingleton {
    static task = 'image-segmentation';
    static modelId = 'Xenova/face-parsing';
    static quantized = true;
}

const IMAGE_SEGMENTATION_NODE_STYLE = `
.container {
    position: relative;
}

.container, .image, .masks {
    width: 100%;
    height: 100%;
}

.image, .masks {
    position: absolute;
}

.image {
    z-index: 1;
}

.masks {
    z-index: 2;
}

canvas {
    position: absolute;
    width: 100%;
    height: 100%;
    opacity: 0.6;
}
`


// Mapping of label to colour
const colours = [
    [234, 76, 76], // red
    [28, 180, 129], // sea green
    [234, 155, 21], // orange
    [67, 132, 243], // blue
    [243, 117, 36], // orange-red
    [145, 98, 243], // purple
    [21, 178, 208], // cyan
    [132, 197, 33], // lime
];

class ImageSegmentationNode extends BasePipelineNode {
    constructor() {
        super(ImageSegmentationPipelineSingleton, IMAGE_SEGMENTATION_NODE_STYLE);

        this.masks = document.createElement('div');
        this.masks.className = 'masks';
        this.root.appendChild(this.masks);

        this.image = document.createElement('div');
        this.image.className = 'image';
        this.root.appendChild(this.image);
    }

    connectedCallback() {
        const masks = this.masks;

        // Attach hover event to image container
        masks.addEventListener('mousemove', e => {
            const canvases = masks.getElementsByTagName('canvas');
            if (canvases.length === 0) return;

            // Get bounding box
            const bb = masks.getBoundingClientRect();

            // Get the mouse coordinates relative to the container
            const mouseX = clamp((e.clientX - bb.left) / bb.width);
            const mouseY = clamp((e.clientY - bb.top) / bb.height);

            // Loop over all canvases
            for (const canvas of canvases) {

                const canvasX = canvas.width * mouseX;
                const canvasY = canvas.height * mouseY;

                // Get the pixel data of the mouse coordinates
                const context = canvas.getContext('2d');
                const pixelData = context.getImageData(canvasX, canvasY, 1, 1).data;

                // Apply hover effect if not fully opaque
                if (pixelData[3] < 255) {
                    canvas.style.opacity = 0.1;
                } else {
                    canvas.style.opacity = 0.8;
                    // TODO: Show label
                    // status.textContent = canvas.getAttribute('data-label');
                }
            }
        });

        // Reset canvas opacities on mouse exit
        this.addEventListener('mouseleave', e => {
            const canvases = [...masks.getElementsByTagName('canvas')];
            if (canvases.length > 0) {
                canvases.forEach(c => c.style.opacity = 0.6);
                // TODO: Clear label
                // status.textContent = '';
            }
        })
    }

    // Render a mask on the image
    renderMask({ mask, label }, i) {
        // Create new canvas
        const canvas = document.createElement('canvas');
        canvas.width = mask.width;
        canvas.height = mask.height;
        canvas.setAttribute('data-label', label);

        // Create context and allocate buffer for pixel data
        const context = canvas.getContext('2d');
        const imageData = context.createImageData(canvas.width, canvas.height);
        const pixelData = imageData.data;

        // Choose colour based on index
        const [r, g, b] = colours[i % colours.length];

        // Fill mask with colour
        for (let i = 0; i < pixelData.length; ++i) {
            if (mask.data[i] !== 0) {
                const offset = 4 * i;
                pixelData[offset] = r;          // red
                pixelData[offset + 1] = g;      // green
                pixelData[offset + 2] = b;      // blue
                pixelData[offset + 3] = 255;    // alpha (fully opaque)
            }
        }

        // Draw image data to context
        context.putImageData(imageData, 0, 0);

        // Add canvas to container    
        this.masks.appendChild(canvas);
    }

    async runWithInputs(inputs, services) {
        const { image, option } = inputs;
        if (!image?.canvasId) {  // No input node
            this.dispatchEvent(new CustomEvent('outputs', { detail: { result: null } }));
            return;
        }

        // Clear masks
        this.masks.innerHTML = '';

        const canvas = services.resourceService.get(image.canvasId);
        this.image.appendChild(canvas);
        const data = canvas.toDataURL();

        const segmenter = await this.instance;

        // Predict segments
        const output = await segmenter(data);
        // console.log(output);

        // Render masks
        output.forEach((x, i) => this.renderMask(x, i));

        // TODO improve output
        const result = { done: true }

        this.dispatchEvent(new CustomEvent('outputs', { detail: { 'result': result } }));
    }
}

export default { nodeSpec: NODE_SPEC, nodeImpl: ImageSegmentationNode };
