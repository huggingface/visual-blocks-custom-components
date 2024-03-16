// Clamp a value inside a range [min, max]
export function clamp(x: number, min = 0, max = 1) {
  return Math.max(Math.min(x, max), min);
}

export function blobToBase64(blob: Blob): Promise<string | ArrayBuffer> {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string | ArrayBuffer);
    reader.readAsDataURL(blob);
  });
}

export function compareObjects(obj1: any, obj2: any) {
  return JSON.stringify(obj1) === JSON.stringify(obj2);
}

export function isWebGPUAvailable() {
  return "gpu" in navigator;
}
