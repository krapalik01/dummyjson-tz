import type { ProductsResponse } from "./types";

export async function fetchProducts(params: {
  q?: string;
  limit: number;
  skip: number;
}): Promise<ProductsResponse> {
  const { q, limit, skip } = params;

  const base = q?.trim()
    ? `https://dummyjson.com/products/search?q=${encodeURIComponent(q.trim())}`
    : "https://dummyjson.com/products";

  const url = new URL(base);
  url.searchParams.set("limit", String(limit));
  url.searchParams.set("skip", String(skip));

  const res = await fetch(url.toString());
  if (!res.ok) throw new Error("Ошибка загрузки товаров");

  const data: ProductsResponse = await res.json();
  return data;
}
