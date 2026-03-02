import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Product, ProductCreate } from '../../models/product';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ProductService {

  private apiUrl = 'http://localhost:5000/api/products';

  constructor(private http: HttpClient) {}

 getProductsByShop(shopId1: string): Observable<Product[]> {
    // Récupère token et shopId depuis localStorage
    const token = localStorage.getItem('token');
    const shopId = localStorage.getItem('shopId');

    if (!token || !shopId) {
      throw new Error('Token ou shopId manquant');
    }

    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    return this.http.get<Product[]>(`${this.apiUrl}/shop/${shopId}`, { headers });
  }

updateProduct(productId: string, data: Partial<Product>): Observable<Product> {
  const token = localStorage.getItem('token');
  if (!token) throw new Error('Token manquant');

  const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

  return this.http.put<Product>(`${this.apiUrl}/${productId}`, data, { headers });
}


createProduct(data: ProductCreate): Observable<Product> {
  const token = localStorage.getItem('token');
  if (!token) throw new Error('Token manquant');

  const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

  return this.http.post<Product>(`${this.apiUrl}/`, data, { headers });
}

private refreshNeeded = new Subject<void>();
refreshNeeded$ = this.refreshNeeded.asObservable();

notifyRefresh() {
  this.refreshNeeded.next();
}


}
