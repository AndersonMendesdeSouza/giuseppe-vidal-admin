export interface ProductRequest {
  name: string;
  description?: string;
  category: string;
  price: number;
  promoPrice?: number;
  isActive?: boolean;
  stockEnabled?: boolean;
  stock?: number;
}
