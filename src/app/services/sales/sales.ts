import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { AuthService } from '../auth/auth';

@Injectable({
  providedIn: 'root',
})
export class SalesService {
  private apiUrl = 'http://localhost:5000/api/sales';

  constructor(private http: HttpClient, private authService: AuthService) {}

  // Créer une vente
  createSale(saleData: any): Observable<any> {
    const shopId = this.authService.getShopId();      // redirige si manquant
    const headers = this.authService.getAuthHeaders(); // ajoute Authorization

    // On ajoute shopId au body pour le backend
    const dataWithShop = { ...saleData, shopId };

    return this.http.post<any>(this.apiUrl, dataWithShop, { headers });
  }

  // Récupère toutes les ventes du shop
  getSalesByShop(): Observable<any[]> {
    const shopId = this.authService.getShopId();
    const headers = this.authService.getAuthHeaders();

    // envoie shopId en query param
    return this.http.get<any[]>(`${this.apiUrl}?shopId=${shopId}`, { headers });
  }

  // Récupère une vente par ID
  getSaleById(saleId: string): Observable<any> {
    const headers = this.authService.getAuthHeaders();

    return this.http.get<any>(`${this.apiUrl}/${saleId}`, { headers });
  }


   private refreshNeeded = new Subject<void>();
  refreshNeeded$ = this.refreshNeeded.asObservable();

  notifyRefresh() {
    this.refreshNeeded.next();
  }

}
