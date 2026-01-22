export const ProductCategoryEnum = {
  FOOD: "FOOD",
  DRINK: "DRINK",
  ADDON: "ADDON",
  DESSERT: "DESSERT",
} as const;
export type ProductCategoryEnum =
  (typeof ProductCategoryEnum)[keyof typeof ProductCategoryEnum];
