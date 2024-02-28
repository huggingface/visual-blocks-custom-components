import type { CustomNodeInfo, NodeSpec } from "@visualblocks/custom-node-types";
import {
    DataType,
    Category,
    EditorType,
} from "@visualblocks/custom-node-types";
import { PipelineSingleton, BasePipelineNode } from "./base";

import { COLLECTION_NAME } from "../constants";

const NODE_SPEC: NodeSpec = {
    id: "transformers-text-classification",
    name: "Text Classification",
    description: "TODO",

    category: Category.PROCESSOR,
    collection: COLLECTION_NAME,

    // Properties.
    propertySpecs: [],

    // Inputs.
    inputSpecs: [
        {
            name: "text",
            type: "string",
            editorSpec: {
                type: EditorType.TEXT_INPUT,
            },
        },
    ],

    // Outputs.
    outputSpecs: [
        {
            name: "result",
            type: DataType.CLASSIFICATION_RESULT,
        },
        {
            name: "text",
            type: DataType.STRING,
        },
    ],
};

declare interface Inputs {
    text: string;
}

class TextClassificationPipelineSingleton extends PipelineSingleton {
    static task = "text-classification";
    static modelId = "Xenova/distilbert-base-uncased-finetuned-sst-2-english";
    static quantized = true;
}

const TEXT_CLASSIFICATION_NODE_STYLE = `
.container {
    width: 100%;
    height: 100%;
}
`;

class TextClassificationNode extends BasePipelineNode {
    constructor() {
        super(TextClassificationPipelineSingleton, TEXT_CLASSIFICATION_NODE_STYLE);
    }

    async runWithInputs(inputs: Inputs) {
        const { text } = inputs;
        if (!text) {
            // No input node
            this.dispatchEvent(
                new CustomEvent("outputs", { detail: { result: null, text: text } })
            );
            return;
        }
        const classifier = await this.instance;

        const result = await classifier(text, { topk: 5 });
        const classProb = result.map((e: { label: string; score: string }) => ({
            className: e.label,
            probability: e.score,
        }));

        // Output.
        console.log("Text Classification result:", {
            result: classProb,
            text: text,
        });
        this.dispatchEvent(
            new CustomEvent("outputs", { detail: { result: { classes: classProb }, text: text } })
        );
    }
}

export default {
    nodeSpec: NODE_SPEC,
    nodeImpl: TextClassificationNode,
} as CustomNodeInfo;
