import type { Product, SortState } from "./types";

const SORT_KEY = "products_sort_state";

export function loadSortState(): SortState {
  const raw = localStorage.getItem(SORT_KEY);
  if (!raw) return { key: "price", dir: "asc" };

  try {
    const parsed = JSON.parse(raw) as SortState;
    if (
      (parsed.key === "title" || parsed.key === "price" || parsed.key === "rating") &&
      (parsed.dir === "asc" || parsed.dir === "desc")
    ) {
      return parsed;
    }
  } catch {
    // ignore
  }
  return { key: "price", dir: "asc" };
}

export function saveSortState(state: SortState): void {
  localStorage.setItem(SORT_KEY, JSON.stringify(state));
}

export function sortProducts(products: Product[], sort: SortState): Product[] {
  const dirMul = sort.dir === "asc" ? 1 : -1;

  return [...products].sort((a, b) => {
    const ka = a[sort.key];
    const kb = b[sort.key];

    if (typeof ka === "number" && typeof kb === "number") return (ka - kb) * dirMul;
    return String(ka).localeCompare(String(kb), "ru") * dirMul;
  });
}
