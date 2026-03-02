import { Product } from "./product";

export interface Promotion {
  _id: string;
  productId: Product; // objet peuplé
  shopId: string;
  title: string;
  description: string;
  discountPercent: number;
  startDate: string;
  endDate: string;
  status: 'active' | 'expired';
  createdAt: string;
  updatedAt: string;
}
