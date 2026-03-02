import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError, Subject } from 'rxjs';
import { Router } from '@angular/router';
import { getAuthData } from '../auth/auth.util';
import { Purchase } from '../../models/purchase';

@Injectable({
  providedIn: 'root'
})
export class PurchaseService {

  private apiUrl = 'http://localhost:5000/api/purchases';

  private refreshNeeded = new Subject<void>();
  refreshNeeded$ = this.refreshNeeded.asObservable();

  constructor(private http: HttpClient, private router: Router) {}

  // 🔐 Créer un achat avec token
  createPurchase(data: Purchase): Observable<any> {
    const authData = getAuthData(this.router);

    if (!authData) {
      return throwError(() => new Error('Token manquant'));
    }

    const headers = new HttpHeaders().set(
      'Authorization',
      `Bearer ${authData.token}`
    );

    return this.http.post(this.apiUrl, data, { headers });
  }

  // 🔐 Récupérer achats par boutique avec token
  getPurchasesByShop(shopId: string): Observable<any[]> {
    const authData = getAuthData(this.router);

    if (!authData) {
      return throwError(() => new Error('Token manquant'));
    }

    const headers = new HttpHeaders().set(
      'Authorization',
      `Bearer ${authData.token}`
    );

    return this.http.get<any[]>(
      `${this.apiUrl}/shop/${shopId}`,
      { headers }
    );
  }

  notifyRefresh() {
    this.refreshNeeded.next();
  }
}
