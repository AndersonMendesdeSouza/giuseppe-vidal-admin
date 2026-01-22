import type { OrderStatusEnum } from "../dtos/enums/orders-status.enum";

type OrderItem = {
  name: string;
  quantity: number;
};

export interface Order {
  id: string;
  number: string;
  customerName: string;
  minutes: number;
  total: number;
  status: OrderStatusEnum;
  items?: OrderItem[];
  courierName?: string;
  urgent?: boolean;
  cookingLabel?: string;
}
