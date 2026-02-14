export function formatPriceRub(value: number): string {
  return value.toLocaleString("ru-RU", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export function formatRating(value: number): string {
  return `${value.toFixed(1)}/5`;
}

export function articleFromId(id: number): string {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let x = (id * 2654435761) >>> 0;
  const parts: string[] = [];
  for (let i = 0; i < 6; i++) {
    parts.push(alphabet[x % alphabet.length]);
    x = (x / alphabet.length) >>> 0;
  }
  return parts.slice(0, 3).join("") + parts.slice(3).join("") + "A";
}
