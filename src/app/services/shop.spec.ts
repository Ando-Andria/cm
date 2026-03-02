import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Shop } from '../models/shop';

@Injectable({
  providedIn: 'root'
})
export class ShopService {

  private apiUrl = 'http://localhost:3000/api/shops';

  constructor(private http: HttpClient) { }

  getActiveShops(): Observable<Shop[]> {
    return this.http.get<Shop[]>(`${this.apiUrl}/active`);
  }
}
