import { CommonModule, NgIf, NgForOf } from '@angular/common';
import { Promotion, PromotionService } from './../../services/promotions/promotion';
import { Component, EventEmitter, OnDestroy, OnInit, Output, ElementRef, Inject } from '@angular/core';
import { ChangeDetectorRef } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { ShopService } from '../../services/shop';
import { ListPromotions } from '../list-promotions/list-promotions';
import { ShopNavbarComponent } from '../navbar-boutique/navbar-boutique';

@Component({
  selector: 'app-promotions',
  imports: [CommonModule, NgIf, NgForOf, ListPromotions, ShopNavbarComponent],
  templateUrl: './promotions.html',
  styleUrl: './promotions.css',
})
export class PromotionComponents implements OnInit , OnDestroy {

  @Output() close = new EventEmitter<void>();
  @Output() promotionsloaded = new EventEmitter<void>();

  promotions: Promotion[] = [];
  loading = false;
  errorMessage = '';
  selectedShop: any = null;
  products: any[] = [];

  constructor(private promotionService: PromotionService, private cdr: ChangeDetectorRef, private ElementRef: ElementRef,  @Inject(DOCUMENT) private document: Document, private shopService: ShopService) {}

  ngOnInit(): void {
    console.log('🟢 Initialisation du composant promotions');

    // ⚡ Ajouter le composant au body
    console.log('🔹 Ajout du composant au body');
    this.document.body.appendChild(this.ElementRef.nativeElement);
    this.document.body.style.overflow = 'hidden';

    // ⚡ S'abonner aux refresh du service
    console.log('🔹 Abonnement à refreshNeeded$');
    this.promotionService.refreshNeeded$.subscribe({
      next: () => {
        console.log('🔄 Refresh reçu via refreshNeeded$, appel loadPromotions()');
        this.loadPromotions();
      },
      error: (err) => console.error('❌ Erreur subscription refreshNeeded$', err)
    });

    // ⚡ Charger les promotions dès le démarrage
    console.log('📌 Appel initial de loadPromotions()');
    this.loadPromotions();
  }

  ngOnDestroy(): void {
    this.ElementRef.nativeElement.remove(); // Nettoie le DOM
    this.document.body.style.overflow = 'auto'; // Restaure le scroll du fond
  }

loadPromotions(): void {
  console.log('📌 loadPromotions() appelé');

  this.loading = true;
  console.log('⏳ loading mis à true');

  // Vérifier si le service existe
  if (!this.promotionService || !this.promotionService.getActivePromotions) {
    console.error('❌ promotionService ou getActivePromotions non défini');
    this.loading = false;
    return;
  }

  console.log('🔗 Appel du service getActivePromotions()...');
  this.promotionService.getActivePromotions().subscribe({
    next: (data) => {
      console.log('✅ Réponse du backend reçue:', data);

      this.promotions = data;

      console.log(`📊 Nombre de promotions reçues: ${data.length}`);

      // Émission de l’événement
      this.promotionsloaded.emit();
      console.log('📢 promotionsloaded émis');

      this.loading = false;
      console.log('⏹ loading mis à false');

      this.cdr.detectChanges();
      console.log('🔄 detectChanges() appelé');
    },
    error: (err) => {
      console.error('❌ Erreur récupération promotions:', err);

      this.errorMessage = 'Impossible de charger les promotions.';
      console.log('⚠️ errorMessage mis à jour:', this.errorMessage);

      this.loading = false;
      console.log('⏹ loading mis à false après erreur');
    }
  });

  console.log('🔚 Fin de loadPromotions() (abonnement en cours)');
}

  closeModal(){
    this.close.emit();
  }

  viewDetailsShop(shopId: string) {
    console.log('Affichage des détails de la boutique avec ID :', shopId);
    this.shopService.getShopById(shopId).subscribe({
      next: (data) => {
        this.selectedShop = data;

        this.shopService.getProductsByShop(shopId).subscribe({
          next: (productsData) => {
            this.products = productsData.map(p => ({
              ...p,
              price: Number(p.price)
            }));
          },
          error: () => {
            this.products = [];
          }
        });
      },
      error: () => {
        this.selectedShop = null;
        this.products = [];
      }
    });
  }


}
