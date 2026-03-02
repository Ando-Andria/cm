import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule, NgIf, NgFor } from '@angular/common';
import { map } from 'rxjs/operators';
import { SalesService } from '../../services/sales/sales';
import { Footer } from '../footer/footer';

@Component({
  selector: 'app-liste-ventes',
  imports: [CommonModule, NgIf, NgFor, Footer],
  templateUrl: './liste-ventes.html',
  styleUrl: './liste-ventes.css',
})
export class SalesListComponent implements OnInit {

  sales: any[] = [];
  loading = true;
  shopId = ''; // id de la boutique actuelle

  constructor(private salesService: SalesService, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
     const storedShopId = localStorage.getItem('shopId');
    if (!storedShopId) {
      console.error('Aucun shopId trouvé, redirection vers login');
      return;
    }

    this.shopId = storedShopId;
    this.loadSales();
     this.salesService.refreshNeeded$.subscribe(() => {
    this.loadSales(); // 🔥 recharge la liste
  });
  }

  loadSales() {
    this.loading = true;
    this.salesService.getSalesByShop()
      .pipe(
        map(sales => sales.sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime())) // tri par date desc
      )
      .subscribe({
        next: data => {
          this.sales = data;
          this.loading = false;
          this.cdr.detectChanges();
        },
        error: err => {
          console.error('Erreur récupération ventes:', err);
          this.loading = false;
        }
      });
  }
  formatDate(dateStr: string) {
    const d = new Date(dateStr);
    return d.toLocaleDateString() + ' ' + d.toLocaleTimeString();
  }
}
