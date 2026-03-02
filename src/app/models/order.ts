export interface ProductInOrder {
  productId: {
    _id: string;
    name: string;
    price: number;
  };
  quantity: number;
  price: number;
}

export interface Shop {
  _id: string;
  name: string;
}

export interface Order {
  _id: string;
  shopId: Shop;
  customerId: string;
  products: ProductInOrder[];
  totalAmount: number;
  status: string;
  paymentStatus: string;
  deliveryStatus: string;
  createdAt: string;
}
