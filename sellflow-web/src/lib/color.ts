export function withHexOpacity(color: string, opacityPercent: number): string {
  const normalized = /^#[0-9a-f]{6}$/i.test(color) ? color : "#000000";
  const opacity = Math.min(100, Math.max(0, opacityPercent));
  const alpha = Math.round((opacity / 100) * 255).toString(16).padStart(2, "0");

  return `${normalized}${alpha}`;
}
