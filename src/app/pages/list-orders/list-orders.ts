import { NgFor, NgIf } from '@angular/common';
// pages/orders/list-orders.component.ts
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { OrderService } from '../../services/orders/orders';
import { CommonModule } from '@angular/common';
import { ShopNavbarComponent } from '../navbar-boutique/navbar-boutique';
import { Footer } from '../footer/footer';

@Component({
  selector: 'app-list-orders',
  templateUrl: './list-orders.html',
  imports: [CommonModule, NgIf ,NgFor, ShopNavbarComponent, Footer],
  styleUrls: ['./list-orders.css'],
})
export class ListOrdersComponent implements OnInit {

  orders: any[] = [];
  loading = false;
  shopId = '';

  constructor(private orderService: OrderService, private cdr : ChangeDetectorRef) {}

  ngOnInit(): void {
     const storedShopId = localStorage.getItem('shopId');
    if (!storedShopId) {
      console.error('Aucun shopId trouvé, redirection vers login');
      // ici tu peux faire : this.router.navigate(['/login']); si Router injecté
      return;
    }

    this.shopId = storedShopId;
    this.loadOrders();
  }

loadOrders() {
  this.loading = true;               // 🔹 on indique que ça charge
  this.orders = [];                  // 🔹 on vide le tableau pour éviter les erreurs

  this.orderService.getOrdersByShop(this.shopId)
    .subscribe({
      next: (data) => {
        this.orders = data.map(order => ({
          ...order,
          totalQuantity: order.products.reduce((sum: number, p: any) => sum + p.quantity, 0)
        }));

        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Erreur récupération commandes', err);
        this.loading = false;       // 🔹 même en erreur, on quitte le "loading"
      }
    });
}


validateOrder(orderId: string) {
  if (!confirm('⚠️ Voulez-vous vraiment valider cette commande ?')) return;

  this.orderService.validateOrder(orderId)
    .subscribe({
      next: () => {
        alert('Commande validée ✅');
        this.cdr.detectChanges();

        // 🔥 recharge les données depuis l'API
        this.loadOrders();
      },
      error: (err) => {
        console.error(err);
        alert('Erreur lors de la validation');
      }
    });
}

markAsPaid(orderId: string) {
  const confirmed = confirm('⚠️ Confirmer le paiement ?');
  if (!confirmed) return;

  this.orderService.markAsPaid(orderId)
    .subscribe({
      next: () => {
        alert('Paiement enregistré 💳');
        this.cdr.detectChanges();

        // 🔥 Recharge les commandes
        this.loadOrders();
      },
      error: (err) => {
        console.error(err);
        alert('Erreur lors de la mise à jour');
      }
    });
}

markAsDelivered(orderId: string) {
  const confirmed = confirm('⚠️ Commencer la livraison ?');
  if (!confirmed) return;

  this.orderService.markAsDelivered(orderId)
    .subscribe({
      next: () => {
        alert('Commande livrée ✅');
        this.cdr.detectChanges();
        // 🔥 Recharge les commandes
        this.loadOrders();
      },
      error: (err) => {
        console.error(err);
        alert('Erreur livraison');
      }
    });
}
}
