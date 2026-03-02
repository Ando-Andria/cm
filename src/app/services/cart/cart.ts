import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AddToCartRequest, Cart } from '../../models/cart';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  private apiUrl = 'http://localhost:5000/api/cart';

  constructor(private http: HttpClient) {}

  addToCart(data: AddToCartRequest): Observable<Cart> {
    return this.http.post<Cart>(`${this.apiUrl}/add`, data);
  }

  getCart(clientId: string) {
  return this.http.get<{ carts: any[] }>(`${this.apiUrl}/${clientId}`);
}

 updateCart(cartId: string, productId: string, quantity: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/update`, { cartId, productId, quantity });
  }

  // Supprimer un produit du panier
  removeFromCart(cartId: string, productId: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/remove`, { cartId, productId });
  }

   checkoutCart(cartId: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/checkout`, { cartId });
  }

}
