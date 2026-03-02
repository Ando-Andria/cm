import { CommonModule, NgIf } from '@angular/common';
import { Component, EventEmitter, Input, Output, SimpleChanges } from '@angular/core';
import { ProductRatingService } from '../../services/rating/rating';

@Component({
  selector: 'app-product-rating',
  imports: [CommonModule, NgIf],
  templateUrl: './product-rating.html',
  styleUrl: './product-rating.css',
})
export class ProductRating {

  @Input() rating = 0;          // note moyenne
  @Input() productId!: string;
  customerId = '698d97f5577689b61e329ed7';
   @Input() loadRatings = false;      // signal parent


  @Output() ratingChanged = new EventEmitter<number>();

  stars = [1,2,3,4,5];
  hover = 0;

  avgRating = 0;     // moyenne des votes
  totalVotes = 0;

  constructor(private productRatingService: ProductRatingService) {}

   ngOnInit() {
  console.log('🟢 ngOnInit enfant - productId reçu:', this.productId);
  this.loadRating();
}


setRating(value: number) {
  console.log('📌 setRating appelé pour productId:', this.productId, 'customerId:', this.customerId, 'valeur:', value);

  if (!this.productId || !this.customerId) {
    console.warn('⚠️ ProductId ou CustomerId manquant, vote annulé');
    return;
  }

  this.productRatingService.rateProduct(this.productId, this.customerId, value)
    .subscribe({
      next: (res: any) => {
        console.log('✅ Vote enregistré sur le backend:', res);
        this.rating = res.avgRating;
        this.totalVotes = res.totalVotes;
        this.ratingChanged.emit(value);
      },
      error: (err) => console.error('❌ Erreur lors de l\'enregistrement du vote', err)
    });
}

 loadRating() {
    console.log('📌 loadRating appelé pour productId:', this.productId);
    this.productRatingService.getProductRating(this.productId).subscribe({
      next: (res: any) => {
        console.log('✅ Réponse backend getProductRating:', res);
        this.avgRating = res.avgRating;
        this.totalVotes = res.totalVotes;
      },
      error: (err) => console.error('❌ Erreur chargement votes', err)
    });
  }

  setHover(value: number) {
    this.hover = value;
  }
}
