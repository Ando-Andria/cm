import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';

export interface Shop {
  _id: string;
  name: string;
  email?: string;
  website?: string;
  unitNumber?: string;
  floor?: number;
}

export interface Product {
  _id: string;
  title: string;
  name: string;
  price: number;
  description?: string;
  shop?: Shop | null;
}

export interface Promotion {
  _id: string;
  title: string;
  description: string;
  discountPercent: number;
  startDate: string;
  endDate: string;
  product: Product | null;
}

@Injectable({
  providedIn: 'root'
})
export class PromotionService {
  private apiUrl = 'http://localhost:5000/api/promotions';

  constructor(private http: HttpClient) {}

  getActivePromotions(): Observable<Promotion[]> {
    return this.http.get<Promotion[]>(this.apiUrl);
  }

  createPromotion(promotionData: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, promotionData);
  }

    getPromotionsByShop(shopId: string) {
      return this.http.get<Promotion[]>(
        `${this.apiUrl}/shop/${shopId}`
      );
    }

  deletePromotion(id: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }

   private refreshNeeded = new Subject<void>();
  refreshNeeded$ = this.refreshNeeded.asObservable();

  notifyRefresh() {
    this.refreshNeeded.next();
  }

}
