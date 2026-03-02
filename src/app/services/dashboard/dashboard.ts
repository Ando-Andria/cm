import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { getAuthData } from '../auth/auth.util';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  private baseUrl = 'http://localhost:5000/api/dashboard';

  constructor(private http: HttpClient, private router: Router) {}

   getKPIs(): Observable<any> {
    const authData = getAuthData(this.router);

    if (!authData) {
      return throwError(() => new Error('Token ou ShopId manquant'));
    }

    const headers = new HttpHeaders().set('Authorization', `Bearer ${authData.token}`);

    return this.http.get(`${this.baseUrl}/kpi/${authData.shopId}`, { headers });
  }

}
