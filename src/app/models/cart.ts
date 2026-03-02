export interface AddToCartRequest {
  clientId: string;
  shopId: string;
  productId: string;
  quantity: number;
}

export interface CartProduct {
  productId: string;
  quantity: number;
  price: number;
}

export interface Cart {
  _id: string;
  clientId: string;
  shopId: string;
  products: CartProduct[];
  createdAt: string;
  updatedAt: string;
}
