import { ChangeDetectorRef, Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { PromotionService } from '../../services/promotions/promotion';
import { map } from 'rxjs';
import { CommonModule } from '@angular/common';
import { Footer } from '../footer/footer';

@Component({
  selector: 'app-list-promotions',
  imports: [CommonModule, Footer],
  templateUrl: './list-promotions.html',
  styleUrl: './list-promotions.css',
})
export class ListPromotions implements OnChanges {

  @Input() promotions: any[] = [];
  loading = true;
  shopId = '';

  constructor(private promoService: PromotionService, private cdr: ChangeDetectorRef) {}

  ngOnChanges(changes: SimpleChanges) {
     const storedShopId = localStorage.getItem('shopId');
    if (!storedShopId) {
      console.error('Aucun shopId trouvé, redirection vers login');
      return;
    }

    this.shopId = storedShopId;
    if (changes['promotions']) {
      this.loading = false;
    }
  }

  loadPromotions() {
    this.loading = true;

    this.promoService.getPromotionsByShop(this.shopId)
      .pipe(
        map(data => data.sort(
          (a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime()
        ))
      )
      .subscribe({
        next: res => {
          this.promotions = res;
          this.loading = false;
          this.cdr.detectChanges();
        },
        error: err => {
          console.error(err);
          this.loading = false;
        }
      });
  }

  getStatus(promo: any): string {
    const now = new Date();
    return new Date(promo.endDate) < now ? 'expired' : 'active';
  }

  deletePromotion(id: string) {
    const confirmDelete = window.confirm('Supprimer cette promotion ?');
    if (!confirmDelete) return;

    this.promoService.deletePromotion(id).subscribe(() => {
      this.loadPromotions();
    });
  }

  formatDate(date: string) {
    return new Date(date).toLocaleDateString();
  }
}
