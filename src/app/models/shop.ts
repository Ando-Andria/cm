export interface Category {
  _id: string;
  name: string;
  description: string;
}

export interface Shop {
  _id: string;        
  name: string;
  categoryId: Category;
  unitNumber: string;
  phone: string;
  email: string;
  website: string;
  openingHours: string;
  description: string;
  imageUrl: string;
  floor: number;
}
