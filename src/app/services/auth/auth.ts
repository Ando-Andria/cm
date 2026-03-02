import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { tap } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseUrl = 'http://localhost:3000/api/auth/login';

  constructor(private http: HttpClient, private router: Router) {}

  login(email: string, password: string) {
    return this.http.post<any>(this.baseUrl, { email, password }).pipe(
      tap(res => {
        if (res.token && typeof window !== 'undefined') {
          localStorage.setItem('token', res.token); // stocke le token
        }
      })
    );
  }

 getToken(): string {
    const token = localStorage.getItem('token');
    if (!token) {
      this.router.navigate(['/login']);
      throw new Error('Token manquant');
    }
    return token;
  }

  // Récupère le shopId ou redirige si absent
  getShopId(): string {
    const shopId = localStorage.getItem('shopId');
    if (!shopId) {
      this.router.navigate(['/login']);
      throw new Error('ShopId manquant');
    }
    return shopId;
  }

  // Retourne les headers HTTP avec le token
  getAuthHeaders(): HttpHeaders {
    const token = this.getToken(); // appelle la fonction qui gère la redirection
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

    logout(): void {
    localStorage.clear();
    this.router.navigate(['/login']);
  }

}
