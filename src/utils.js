// Clamp a value inside a range [min, max]
export function clamp(x, min = 0, max = 1) {
  return Math.max(Math.min(x, max), min);
}

export async function getHubModels(
  pipeline_tag,
  limit = 20,
  sort = "downloads",
  direction = "-1"
) {
  const res = await fetch(
    `https://huggingface.co/api/models?pipeline_tag=${pipeline_tag}&limit=${limit}&sort=${sort}&direction=${direction}`
  );
  const data = await res.json();
  return data.map((e) => ({ value: e.id, label: e.id }));
}

export function blobToBase64(blob) {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result);
    reader.readAsDataURL(blob);
  });
}
