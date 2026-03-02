import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Product } from '../../models/product';
import { AuthService } from '../auth/auth';

@Injectable({
  providedIn: 'root',
})
export class Customers {

   private apiUrl = 'http://localhost:5000/api/customers';

  constructor(private http: HttpClient, private authService: AuthService) {}

 getCustomersByShop() {
    const shopId = this.authService.getShopId();      // redirige si absent
    const headers: HttpHeaders = this.authService.getAuthHeaders();

    return this.http.get<Product[]>(`${this.apiUrl}/shop/${shopId}`, { headers });
  }

}
