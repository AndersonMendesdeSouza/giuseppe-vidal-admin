export const ProductStatusEnum = {
  ACTIVED: "ACTIVED",
  DISABLED: "DISABLED",
} as const;

export type ProductStatusEnum =
  typeof ProductStatusEnum[keyof typeof ProductStatusEnum];
