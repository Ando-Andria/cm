import { PromotionService } from './../../services/promotions/promotion';
import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { MallPlan } from '../../features/mall-plan/mall-plan';
import { ListeCategory } from '../liste-category/liste-category';
import { PromotionComponents } from '../promotions/promotions';
import { ChangeDetectorRef } from '@angular/core';
import { CartModalComponent } from '../../shared/cart-modal/cart-modal';
import { CustomerOrders } from '../customer-orders/customer-orders';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterModule, CommonModule,MallPlan,ListeCategory, PromotionComponents,CartModalComponent,CustomerOrders ],
  templateUrl: './navbar.html',
  styleUrls: ['./navbar.css'],
})
export class NavbarComponent {

@Output() selectCategory = new EventEmitter<string>();

isMallPlanOpen = false;
showCategories = false;
showPromoModal = false;
clientId = '64b8c9e5f1a2c9b1d2e3f4a5'; // ID utilisateur statique pour les tests

constructor(private router: Router, private cdr: ChangeDetectorRef, private PromotionService: PromotionService) {}

toggleCategories() {
  console.log('Toggle categories parent');
  this.showCategories = !this.showCategories;
  console.log('showCategories parent :', this.showCategories);
}

ngOnInit(): void {
  console.log('NavbarComponent initialisé');
  this.PromotionService.getActivePromotions().subscribe({
    next: (data) => this.promotionsCount = data.length,
    error: (err) => {
      console.error('Erreur lors du chargement des promotions dans NavbarComponent :', err);
    }
  });
}

openMallPlan() {
  this.isMallPlanOpen = true;
}

closeMallPlan() {
  this.isMallPlanOpen = false;
  }

  handleCategory(categoryId: string) {
  console.log('Catégorie sélectionnée par l’enfant :', categoryId);
  this.selectCategory.emit(categoryId);
  this.showCategories = false;
}

openPromotionsModal(event: Event) {
  console.log('Ouverture du modal promotions');
  event.preventDefault();
  this.showPromoModal = true;
  console.log('showPromoModal parent:', this.showPromoModal);
  this.cdr.detectChanges();
}

closePromotionsModal() {
  this.showPromoModal = false;
}

promotionsCount = 0;

onPromotionsLoaded(count: number): void {
  this.promotionsCount = count;
}

showOrdersModal = false;

openOrders() {
  this.showOrdersModal = true;
}

closeOrders() {
  this.showOrdersModal = false;
}


}
