import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {Shop } from '../models/shop';
import { Observable, map } from 'rxjs';
import { Product } from '../models/product';

@Injectable({
  providedIn: 'root',
})
export class ShopService {

  private url = "http://localhost:5000/api/shops";

  constructor(private http: HttpClient) { }

getActiveShops(): Observable<Shop[]> {
  return this.http.get<Shop[]>(`${this.url}/active`);
}

getShopById(id: string) {
    return this.http.get<Shop>(`${this.url}/${id}`);
  }

getProductsByShop(shopId: string) {
  return this.http.get<Product[]>(`http://localhost:5000/api/products/shop/${shopId}`);
}

getShopsByCategoryId(categoryId: string): Observable<Shop[]> {
  console.log("=== DEBUG SERVICE SHOP ===");
  console.log("ID reçu dans le service :", categoryId);
  return this.http.get<Shop[]>(`${this.url}/by-category/${categoryId}`);
}

}
