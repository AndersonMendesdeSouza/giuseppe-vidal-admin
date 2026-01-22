import type { ProductStatusEnum } from "../dtos/enums/product-status.enum";

export type CategoryKey =
  | "all"
  | "hamburgers"
  | "sides"
  | "drinks"
  | "desserts"
  | "kids";

export interface Product {
  id: string;
  name: string;
  description: string;
  categoryLabel: string;
  categoryKey: Exclude<CategoryKey, "all">;
  price: number;
  imageUrl: string;
  inStock: ProductStatusEnum;
  available: boolean;
}
