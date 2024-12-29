export const hexToRgb = (hex: string) => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  const r = result ? parseInt(result[1], 16) / 255 : 0
  const g = result ? parseInt(result[2], 16) / 255 : 0
  const b = result ? parseInt(result[3], 16) / 255 : 0
  return { r, g, b }
}
