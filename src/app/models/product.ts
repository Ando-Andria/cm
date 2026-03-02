export interface Product {
  _id: string;
  name: string;
  description?: string;
  price: number;
  status: string;
  categoryId: { _id: string; name: string };
  shopId: string;
  isLowStock?: boolean;
  imageUrl?: string;
  stock : number;
}

export interface ProductUI extends Product {
isFavorite: boolean;
}


// product-create.model.ts
export interface ProductCreate {
  name: string;
  description?: string;
  price: number;
  stock: number;
  status: 'available' | 'inactive' | 'sold_out' | 'promo' | 'out_of_stock';
  categoryId: string; // juste l'ID
  shopId: string;
  imageUrl?: string;
  lowStockThreshold?: number;
}
