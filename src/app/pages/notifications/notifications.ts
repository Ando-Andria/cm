import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { NotificationsServices } from '../../services/notif/notifications-services';
import { NotificationModel } from '../../models/notification';
import { CommonModule, NgIf, NgFor } from '@angular/common';
import { ShopNavbarComponent } from '../navbar-boutique/navbar-boutique';

@Component({
  selector: 'app-notifications',
  imports: [CommonModule, NgIf, NgFor, ShopNavbarComponent],
  templateUrl: './notifications.html',
  styleUrl: './notifications.css',
})
export class Notifications implements OnInit{
  notifications: NotificationModel[] = [];
  shopId = ''; // récupérer depuis auth ou route

  constructor(private notificationService: NotificationsServices, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
     const storedShopId = localStorage.getItem('shopId');
    if (!storedShopId) {
      console.error('Aucun shopId trouvé, redirection vers login');
      return;
    }

    this.shopId = storedShopId;
    this.loadNotifications();
  }

  loadNotifications() {
    this.notificationService
      .getShopNotifications(this.shopId)
      .subscribe(data => {
        this.notifications = data;
        console.log('data :' , data);
        this.cdr.detectChanges();
      });
  }

  markAsRead(notification: NotificationModel) {
    this.notificationService
      .markAsRead(notification._id)
      .subscribe(() => {
        notification.read = true;
      });
  }

  get unreadCount(): number {
    return this.notifications.filter(n => !n.read).length;
  }
}
