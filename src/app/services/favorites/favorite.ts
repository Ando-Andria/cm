import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';

@Injectable({
  providedIn: 'root',
})
export class Favorite {

  private apiUrl = 'http://localhost:5000/api/favorites';

  constructor(private http: HttpClient) {}

   toggleFavorite(userId: string, productId: string, shopId?: string): Observable<any> {
    console.log("API toggleFavorite appelé avec :", { userId, productId, shopId });
    return this.http.post(`${this.apiUrl}/toggle`, { userId, productId, shopId });
  }

  getFavorites(userId: string): Observable<any> {
    console.log("API getFavorites appelé pour userId :", userId);
    return this.http.get(`${this.apiUrl}/user/${userId}`);
  }

}
