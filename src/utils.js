// Clamp a value inside a range [min, max]
export function clamp(x, min = 0, max = 1) {
    return Math.max(Math.min(x, max), min)
}
