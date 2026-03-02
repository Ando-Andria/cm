import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { NotificationModel } from '../../models/notification';


@Injectable({
  providedIn: 'root',
})
export class NotificationsServices {

  private apiUrl = 'http://localhost:5000/api/notifications';

  constructor(private http: HttpClient) {}

  getShopNotifications(shopId: string): Observable<NotificationModel[]> {
    return this.http.get<NotificationModel[]>(
      `${this.apiUrl}/shop/${shopId}`
    );
  }

  markAsRead(notificationId: string) {
    return this.http.patch(
      `${this.apiUrl}/${notificationId}/read`,
      {}
    );
  }
}
