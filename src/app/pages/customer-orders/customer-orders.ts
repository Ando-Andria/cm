import { Component } from '@angular/core';
import { Order } from '../../models/order';
import { OrderService } from '../../services/orders/orders';
import { CommonModule, NgIf } from '@angular/common';
import { Footer } from '../footer/footer';

@Component({
  selector: 'app-customer-orders',
  imports: [CommonModule, NgIf, Footer],
  templateUrl: './customer-orders.html',
  styleUrl: './customer-orders.css',
})
export class CustomerOrders {
 orders: Order[] = [];
  loading = true;
  customerId = '698d97f5577689b61e329ed7';

  constructor(private orderService: OrderService) {}

  ngOnInit(): void {
    this.orderService.getOrdersByCustomer(this.customerId).subscribe({
      next: (data) => {
        this.orders = data;
        this.loading = false;
      },
      error: (err) => {
        console.error(err);
        this.loading = false;
      }
    });
  }

  handleAction(order: Order) {
  console.log('Commande sélectionnée : ', order._id);
}

canMarkDelivered(order: Order): boolean {
  return order.status === 'validated'
      && order.paymentStatus === 'paid'
      && order.deliveryStatus !== 'delivered';
}

markDelivered(order: Order) {
  this.orderService.markAsDeliveredByCustomer(order._id).subscribe({
    next: () => {
      order.deliveryStatus = 'delivered';
      console.log('Commande livrée');
    },
    error: (err) => {
      console.error(err);
    }
  });
}

}
