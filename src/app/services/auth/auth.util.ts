import { Router } from '@angular/router';

export function getAuthData(router: Router): { token: string; shopId: string } | null {
  const token = localStorage.getItem('token');
  const shopId = localStorage.getItem('shopId');

  if (!token || !shopId) {
    router.navigate(['/login']);
    return null;
  }

  return { token, shopId };
}
