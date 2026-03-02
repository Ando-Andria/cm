import { PurchaseService } from './../../services/purchase/purchase';
import { Component, OnInit, Input, ChangeDetectorRef } from '@angular/core';
import { CommonModule, NgIf } from '@angular/common';
import { Footer } from '../footer/footer';

@Component({
  selector: 'app-purchases-list',
  imports: [CommonModule, NgIf, Footer],
  templateUrl: './purchases-list.html',
  styleUrl: './purchases-list.css',
})
export class PurchasesList {

 shopId = '';
  purchases: any[] = [];
  loading = false;

  constructor(
  private purchaseService: PurchaseService,
  private cdr: ChangeDetectorRef,
) {}

  ngOnInit(): void {
     const storedShopId = localStorage.getItem('shopId');
    if (!storedShopId) {
      console.error('Aucun shopId trouvé, redirection vers login');
      return;
    }

    this.shopId = storedShopId;
    if (this.shopId) {
      this.loadPurchases();
    this.purchaseService.refreshNeeded$.subscribe(() => {
    this.loadPurchases(); // 🔥 recharge la liste
  });
    }
  }

  loadPurchases() {
    this.loading = true;
    this.purchaseService.getPurchasesByShop(this.shopId)
      .subscribe({
        next: (data) => {
          this.purchases = data;
          console.log('data', this.purchases);
          this.loading = false;
           this.cdr.detectChanges();
        },
        error: (err) => {
          console.error(err);
          this.loading = false;
        }
      });
  }

}
