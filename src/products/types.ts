export interface Product {
  id: number;
  title: string;
  price: number;
  brand?: string;     // vendor
  rating: number;
  category?: string;  // subtitle under title
  thumbnail?: string; // optional
}

export interface ProductsResponse {
  products: Product[];
  total: number;
  skip: number;
  limit: number;
}

export type SortKey = "title" | "price" | "rating";
export type SortDir = "asc" | "desc";

export interface SortState {
  key: SortKey;
  dir: SortDir;
}
