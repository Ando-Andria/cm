import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ProductRatingService {
  private apiUrl = 'http://localhost:5000/api/ratings'; // ← backend

  constructor(private http: HttpClient) {}

  rateProduct(productId: string, customerId: string, rating: number): Observable<any> {
    return this.http.post(this.apiUrl, { productId, customerId, rating });
  }

  getProductRating(productId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/${productId}`);
  }
}
