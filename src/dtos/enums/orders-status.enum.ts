export const OrderStatusEnum = {
  NEW: "NEW",
  PREPARING: "PREPARING",
  ON_ROUTE: "ON_ROUTE",
} as const;

export type OrderStatusEnum =
  typeof OrderStatusEnum[keyof typeof OrderStatusEnum];
