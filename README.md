# Hugging Face + Visual Blocks Custom Components

<p align="center">
    <br/>
    <picture> 
        <source media="(prefers-color-scheme: dark)" srcset="https://huggingface.co/spaces/hf-vb/README/raw/main/hf-vb-logo-dark.svg" width="400" style="max-width: 100%;">
        <source media="(prefers-color-scheme: light)" srcset="https://huggingface.co/spaces/hf-vb/README/raw/main/hf-vb-logo.svg" width="400" style="max-width: 100%;">
        <img alt="transformers.js javascript library logo" src="https://huggingface.co/spaces/hf-vb/README/raw/main/hf-vb-logo.svg" width="400" style="max-width: 100%;">
    </picture>
    <br/>
</p>

Visual blocks is an amazing tool from our friends at [Google](https://github.com/google/visualblocks)
that allows you to easily create and experiment with machine learning pipelines using a visual interface.
This repository contains the source code for custom components that allow you to use Hugging Face client and server models in your Visual Blocks pipelines.
We've created a few nodes supporting different tasks and models following our [Tasks](https://huggingface.co/tasks) definitions.

> [!NOTE]
> Visual Blocks seems to be mostly working in Chrome. If you are having trouble with the interface, try using Chrome, and please submit an [issue](https://github.com/google/visualblocks/issues) to the Visual Blocks team.

Important links:

- https://visualblocks.withgoogle.com/
- https://www.npmjs.com/package/huggingface-visualblocks-nodes
- https://cdn.jsdelivr.net/npm/huggingface-visualblocks-nodes@latest

<details>
<summary> Table of Contents</summary>

- [How to use the custom components](#how-to-use-the-custom-components)
- [Nodes and Examples](#nodes-and-examples)
  - [Client Nodes](#client-nodes)
    - [Translation](#translation)
    - [Token Classification](#token-classification)
    - [Text Classification](#text-classification)
    - [Object Detection](#object-detection)
    - [Image Segmentation](#image-segmentation)
    - [Image Classification](#image-classification)
    - [Depth Estimation](#depth-estimation)
    - [Background Removal](#background-removal)
  - [Server Nodes](#server-nodes)
    - [Text Generation and Chat Completion](#text-generation-and-chat-completion)
    - [Fill Mask](#fill-mask)
    - [Image Classification](#image-classification-1)
    - [Summarization](#summarization)
    - [Text Classification](#text-classification-1)
    - [Text Generation](#text-generation)
    - [Text to Image](#text-to-image)
    - [Token Classification](#token-classification-1)
  - [Extra Examples](#extra-examples)
- [Local Development](#local-development)

</details>

## How to use the custom components

To start playing with our custom components you need to **Add a custom node** to your Visual Blocks project. First you need to start a new project [https://visualblocks.withgoogle.com/#/edit/new](https://visualblocks.withgoogle.com/#/edit/new), then click on the "+" button in the bottom left corner to add a new node.

<img src="https://huggingface.co/spaces/hf-vb/README/resolve/main/left_button.png" width="200">

Then input the pre-bundled code from our npm package. You can do this by pasting the following link into the input field and clicking "Submit":

```
https://cdn.jsdelivr.net/npm/huggingface-visualblocks-nodes@latest
```

<img src="https://huggingface.co/spaces/hf-vb/README/resolve/main/custom_node.jpg" width="450">

Then you will be able to see three Hugging Face Collections: Client, Server and Common.

<img src="https://huggingface.co/spaces/hf-vb/README/resolve/main/collections.jpg" width="250">

# Nodes and Examples

## Client Nodes

Client nodes are nodes running tranformers pipelines on the client side using [Transformers.js](https://github.com/xenova/transformers.js). All Client nodes have WASM and WebGPU (experimental) backend support, and you can find web-compatible models by visiting https://huggingface.co/models?library=transformers.js.

> [!NOTE]
> WebGPU support in transformers.js is still experimental and may not work on all devices. Not all models are supported by WebGPU backend yet.

### Translation

<img src="https://huggingface.co/spaces/hf-vb/README/resolve/main/translation.jpg" width="500">

[**Translation Node Example**](https://visualblocks.withgoogle.com/#/edit/new_hfdemo?project_json=https://cdn.jsdelivr.net/npm/huggingface-visualblocks-nodes@latest/examples/client/translation_client_.json)

More info:

- https://huggingface.co/tasks/translation
- https://huggingface.co/docs/transformers.js/api/pipelines#module_pipelines.TranslationPipeline

### Token Classification

<img src="https://huggingface.co/spaces/hf-vb/README/resolve/main/token.jpg" width="500">

[**Token Classification Node Exampl**e](https://visualblocks.withgoogle.com/#/edit/new_hfdemo?project_json=https://cdn.jsdelivr.net/npm/huggingface-visualblocks-nodes@latest/examples/client/token_classification_client_.json)

More info:

- https://huggingface.co/tasks/token-classification
- https://huggingface.co/docs/transformers.js/api/pipelines#module_pipelines.TokenClassificationPipeline

### Text Classification

<img src="https://huggingface.co/spaces/hf-vb/README/resolve/main/text-classification.jpg" width="500">

[**Text Classification Node Example**](https://visualblocks.withgoogle.com/#/edit/new_hfdemo?project_json=https://cdn.jsdelivr.net/npm/huggingface-visualblocks-nodes@latest/examples/client/text_classification_client_.json)

More info:

- https://huggingface.co/tasks/text-classification
- https://huggingface.co/docs/transformers.js/api/pipelines#module_pipelines.TextClassificationPipeline

### Object Detection

<img src="https://huggingface.co/spaces/hf-vb/README/resolve/main/object-detc.jpg" width="500">

[**Object Detection Node Example**](https://visualblocks.withgoogle.com/#/edit/new_hfdemo?project_json=https://cdn.jsdelivr.net/npm/huggingface-visualblocks-nodes@latest/examples/client/object_detection_client_.json)

More info:

- https://huggingface.co/tasks/object-detection
- https://huggingface.co/docs/transformers.js/api/pipelines#module_pipelines.ObjectDetectionPipeline

### Image Segmentation

<img src="https://huggingface.co/spaces/hf-vb/README/resolve/main/segment.jpg" width="500">

[**Image Segmentation Node Example**](https://visualblocks.withgoogle.com/#/edit/new_hfdemo?project_json=https://cdn.jsdelivr.net/npm/huggingface-visualblocks-nodes@latest/examples/client/image_segmentation_client_.json)

More info:

- https://huggingface.co/tasks/image-segmentation
- https://huggingface.co/docs/transformers.js/api/pipelines#module_pipelines.ImageSegmentationPipeline

### Image Classification

<img src="https://huggingface.co/spaces/hf-vb/README/resolve/main/class.jpg" width="500">

[**Image Classification Node Example**](https://visualblocks.withgoogle.com/#/edit/new_hfdemo?project_json=https://cdn.jsdelivr.net/npm/huggingface-visualblocks-nodes@latest/examples/client/image_classification_client_.json)

More info:

- https://huggingface.co/tasks/image-classification
- https://huggingface.co/docs/transformers.js/api/pipelines#module_pipelines.ImageClassificationPipeline

### Depth Estimation

<img src="https://huggingface.co/spaces/hf-vb/README/resolve/main/dept-es.jpg" width="500">

[Depth Estimation Node Example](https://visualblocks.withgoogle.com/#/edit/new_hfdemo?project_json=https://cdn.jsdelivr.net/npm/huggingface-visualblocks-nodes@latest/examples/client/depth_estimation_client_.json)

More info:

- https://huggingface.co/tasks/depth-estimation
- https://huggingface.co/docs/transformers.js/api/pipelines#module_pipelines.DepthEstimationPipeline

### Background Removal

<img src="https://huggingface.co/spaces/hf-vb/README/resolve/main/removal.jpg" width="500">

[**Background Removal Node Example**](https://visualblocks.withgoogle.com/#/edit/new_hfdemo?project_json=https://cdn.jsdelivr.net/npm/huggingface-visualblocks-nodes@latest/examples/client/background_removal_client_.json)

## Server Nodes

Server nodes are nodes running Transformers pipeline tasks using the [Hugging Face Serverless API](https://huggingface.co/docs/api-inference/en/index). For a few selected LLM models, it's running using our hosted [Text Generation Inference](https://huggingface.co/docs/text-generation-inference/en/index), our fast, optimized inference for LLMs.

> [!NOTE]
> You can use the Hugging Face Serverless API for free with limited usage, after which you'll be rate limited. If you need more usage, you can create an account at https://huggingface.co/join and get an API token at https://huggingface.co/settings/tokens or log in using the Hugging Face Login node.

For server nodes you have the option to Login using your Hugging Face account to get more usage and access to private models. Using **Hugging Face Hub Login**

<img src="https://huggingface.co/spaces/hf-vb/README/resolve/main/server/button-auth.jpg" width="250">

<img src="https://huggingface.co/spaces/hf-vb/README/resolve/main/server/auth.jpg" width="400">

<img src="https://huggingface.co/spaces/hf-vb/README/resolve/main/server/button-logged.jpg" width="250">

If successful, you can obtain your **Apikey** directly from the **Hugging Face Hub Login** node.

<img src="https://huggingface.co/spaces/hf-vb/README/resolve/main/server/logged.jpg" width="350">

### Text Generation and Chat Completion

<img src="https://huggingface.co/spaces/hf-vb/README/resolve/main/server/chat-template.jpg" width="500">

[**Chat Template Text Generation Node Example**](https://visualblocks.withgoogle.com/#/edit/new_hfdemo?project_json=https://cdn.jsdelivr.net/npm/huggingface-visualblocks-nodes@latest/examples/server/chat_template_text_generation_server_.json)

<img src="https://huggingface.co/spaces/hf-vb/README/resolve/main/chat_completion.jpg" width="500">

[**Chat Completion Node Example**](https://visualblocks.withgoogle.com/#/edit/new_hfdemo?project_json=https://cdn.jsdelivr.net/npm/huggingface-visualblocks-nodes@latest/examples/server/chat_completion_server_.json)

More info:

- https://huggingface.co/tasks/text-generation

### Fill Mask

<img src="https://huggingface.co/spaces/hf-vb/README/resolve/main/server/fill-mask.jpg" width="500">

[**Fill Mask Node Example**](https://visualblocks.withgoogle.com/#/edit/new_hfdemo?project_json=https://cdn.jsdelivr.net/npm/huggingface-visualblocks-nodes@latest/examples/server/fill_mask_server_.json)

More info:

- https://huggingface.co/tasks/fill-mask

### Image Classification

<img src="https://huggingface.co/spaces/hf-vb/README/resolve/main/server/image-class.jpg" width="500">

[**Image Classification Node Example**](https://visualblocks.withgoogle.com/#/edit/new_hfdemo?project_json=https://cdn.jsdelivr.net/npm/huggingface-visualblocks-nodes@latest/examples/server/image_classification_server_.json)

More info:

- https://huggingface.co/tasks/image-classification

### Summarization

<img src="https://huggingface.co/spaces/hf-vb/README/resolve/main/server/summarization.jpg" width="500">

[**Summarization Node Example**](https://visualblocks.withgoogle.com/#/edit/new_hfdemo?project_json=https://cdn.jsdelivr.net/npm/huggingface-visualblocks-nodes@latest/examples/server/summarization_server_.json)

More info:

- https://huggingface.co/tasks/summarization

### Text Classification

<img src="https://huggingface.co/spaces/hf-vb/README/resolve/main/server/text-class.jpg" width="500">

[**Text Classification Node Example**](https://visualblocks.withgoogle.com/#/edit/new_hfdemo?project_json=https://cdn.jsdelivr.net/npm/huggingface-visualblocks-nodes@latest/examples/server/text_classification_server_.json)

More info:

- https://huggingface.co/tasks/text-classification

### Text Generation

<img src="https://huggingface.co/spaces/hf-vb/README/resolve/main/server/text-generation.jpg" width="500">

[**Text Generation Node Example**](https://visualblocks.withgoogle.com/#/edit/new_hfdemo?project_json=https://cdn.jsdelivr.net/npm/huggingface-visualblocks-nodes@latest/examples/server/text_generation_server_.json)

More info:

- https://huggingface.co/tasks/text-generation

### Text to Image

<img src="https://huggingface.co/spaces/hf-vb/README/resolve/main/server/text-to-image.jpg" width="500">

[**Text to Image Node Example**](https://visualblocks.withgoogle.com/#/edit/new_hfdemo?project_json=https://cdn.jsdelivr.net/npm/huggingface-visualblocks-nodes@latest/examples/server/text_to_image_server_.json)

More info:

- https://huggingface.co/tasks/text-to-image

### Token Classification

<img src="https://huggingface.co/spaces/hf-vb/README/resolve/main/server/token-class.jpg" width="500">

[**Token Classification Node Example**](https://visualblocks.withgoogle.com/#/edit/new_hfdemo?project_json=https://cdn.jsdelivr.net/npm/huggingface-visualblocks-nodes@latest/examples/server/token_classification_server_.json)

More info:

- https://huggingface.co/tasks/token-classification

## Extra Examples

[**Background Removal Text to Image**](https://visualblocks.withgoogle.com/#/edit/new_hfdemo?project_json=https://cdn.jsdelivr.net/npm/huggingface-visualblocks-nodes@latest/examples/extras/background_removal_text_to_image.json)

[**Chat Completion Text to Image Depth**](https://visualblocks.withgoogle.com/#/edit/new_hfdemo?project_json=https://cdn.jsdelivr.net/npm/huggingface-visualblocks-nodes@latest/examples/extras/chat_completion_txt2img_depth.json)

[**Image Segmentation Webcam Client**](https://visualblocks.withgoogle.com/#/edit/new_hfdemo?project_json=https://cdn.jsdelivr.net/npm/huggingface-visualblocks-nodes@latest/examples/extras/image_segmentation_webcam_client.json)

# Local Development

1. Clone the repository

   ```bash
   git clone https://github.com/huggingface/visual-blocks-custom-components.git
   cd visual-blocks-custom-components
   ```

2. Install the dependencies

   ```bash
   npm i
   ```

3. Run the development server

   ```bash
   npm run dev
   ```

4. Visit Google's staging server

5. Click the + in the bottom left corner to add the custom nodes.

6. Paste in the link to the script (e.g., http://localhost:8080/index.js) and click "Submit".
