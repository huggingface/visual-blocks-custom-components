import { TASKS_DATA } from "@huggingface/tasks";

export const COLLECTION_NAME_CLIENT = "Hugging Face Collection (Client)";
export const COLLECTION_NAME_SERVER = "Hugging Face Collection (Server)";
export const COLLECTION_NAME_SHARED = "Hugging Face Collection";

// d3 schemePaired
export const COLORS = [
  [166, 206, 227],
  [31, 120, 180],
  [178, 223, 138],
  [51, 160, 44],
  [251, 154, 153],
  [227, 26, 28],
  [253, 191, 111],
  [255, 127, 0],
  [202, 178, 214],
  [106, 61, 154],
  [255, 255, 153],
  [177, 89, 40],
];

export const CURATED_MODELS = {
  text_to_image: [
    {
      value: "stabilityai/stable-diffusion-xl-base-1.0",
      label: "stabilityai/stable-diffusion-xl-base-1.0",
    },
    {
      value: "stabilityai/stable-diffusion-2-1",
      label: "stabilityai/stable-diffusion-2-1",
    },
    {
      value: "playgroundai/playground-v2.5-1024px-aesthetic",
      label: "playgroundai/playground-v2.5-1024px-aesthetic",
    },
    {
      value: "segmind/SSD-1B",
      label: "segmind/SSD-1B",
    },
  ],
  token_classification: (TASKS_DATA["token-classification"]?.models ?? []).map(
    (m) => ({
      value: m.id,
      label: m.id,
    })
  ),
  text_generation: (TASKS_DATA["text-generation"]?.models ?? []).map((m) => ({
    value: m.id,
    label: m.id,
  })),
  text_classification: (TASKS_DATA["text-classification"]?.models ?? []).map(
    (m) => ({
      value: m.id,
      label: m.id,
    })
  ),
  summarization: (TASKS_DATA["summarization"]?.models ?? []).map((m) => ({
    value: m.id,
    label: m.id,
  })),
  image_classification: (TASKS_DATA["image-classification"]?.models ?? []).map(
    (m) => ({
      value: m.id,
      label: m.id,
    })
  ),
  fill_mask: (TASKS_DATA["fill-mask"]?.models ?? []).map((m) => ({
    value: m.id,
    label: m.id,
  })),
};
