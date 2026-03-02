export interface Purchase {
  shopId: string;
  supplierId: string;
  productId: string;
  quantity: number;
  purchasePrice: number;
  date?: Date;
}

