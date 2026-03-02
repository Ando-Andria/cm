import { Component, OnInit } from '@angular/core';
import { Shop } from '../../models/shop';
import { ShopService } from '../../services/shop';
import { CommonModule, NgIf, NgForOf } from '@angular/common';
import { Product, ProductUI } from '../../models/product';
import { LOCALE_ID } from '@angular/core';
import { NavbarComponent } from "../navbar/navbar";
import { ChangeDetectorRef } from '@angular/core';
import { FavoriteButton } from '../../shared/favorite-button/favorite-button';
import { Favorite } from '../../services/favorites/favorite';
import { AddToCartButtonComponent } from "../../shared/add-to-cart-button/add-to-cart-button";
import { ProductRating } from '../product-rating/product-rating';
import { ProductRatingService } from '../../services/rating/rating';
import { Footer } from '../footer/footer';

const STATIC_USER_ID = '64b8c9e5f1a2c9b1d2e3f4a5';

@Component({
  selector: 'app-shop-list',
  standalone: true,
  providers: [{ provide: LOCALE_ID, useValue: 'fr-FR' }],
  imports: [NgIf, NgForOf, CommonModule, NavbarComponent, FavoriteButton, AddToCartButtonComponent, ProductRating, Footer],
  templateUrl: './shop-list.html',
  styleUrls: ['./shop-list.css'],
})
export class ShopList implements OnInit {


  shops: Shop[] = [];
  loading = false;
  errorMessage = '';
  selectedShop: Shop | null = null;
  products: ProductUI[] = [];
  isFavorite: boolean = false;

  avgRatings: { [productId: string]: number } = {};

  userId = '698d97f5577689b61e329ed7';
  selectedCategoryId: string | null = null; // ✅ IMPORTANT

  constructor(private shopService: ShopService, private cdr: ChangeDetectorRef, private favoriteService: Favorite, private productRatingService : ProductRatingService) {}

  ngOnInit(): void {
    this.loadAllShops(); // charge tout au départ
  }

  // 🔹 Charger toutes les boutiques
  loadAllShops(): void {
    this.loading = true;
    this.errorMessage = '';

    this.shopService.getActiveShops().subscribe({
      next: (data) => {
        this.shops = data ?? [];
        this.loading = false;
      },
      error: (err) => {
        console.error(err);
        this.errorMessage = "Erreur chargement boutiques";
        this.loading = false;
      }
    });
  }


loadShopsByCategory(categoryId: string): void {
  console.log("=== DEBUG API CATEGORY ===");
  console.log("ID envoyé au backend :", categoryId);

  this.loading = true;
  this.shops = [];
  this.shopService.getShopsByCategoryId(categoryId).subscribe({
    next: (data) => {
      console.log("Réponse backend :", data);
      console.log("Nombre reçu :", data?.length);

      this.shops = data ?? [];
      this.loading = false;
      this.cdr.detectChanges();
      console.log('loading après API :', this.loading);
    },
    error: (err) => {
      console.error("Erreur API :", err);
      this.loading = false;
      this.cdr.detectChanges();
      console.log('loading après erreur API :', this.loading);
    }
  });
}

  // 🔹 Reçoit l'événement du navbar
  onSelectCategory(categoryId: string) {
    console.log('Catégorie reçue dans ShopList:', categoryId);

    this.selectedCategoryId = categoryId;

    if (categoryId) {
      this.loadShopsByCategory(categoryId);
    } else {
      this.loadAllShops();
    }
  }

  // 🔹 Réinitialiser filtre (optionnel)
  resetFilter() {
    this.selectedCategoryId = null;
    this.loadAllShops();
  }

  // ----------------------------------------------------------------
  // LE RESTE DE TON CODE (inchangé)
  // ----------------------------------------------------------------

  getCategoryIconFromShop(shop: Shop | null): string {
    const categoryName = shop?.categoryId?.name;
    const icons: Record<string, string> = {
      mode: '👗',
      restauration: '🍽️',
      electronique: '💻',
      beaute: '💄',
      services: '🏦',
      divertissement: '🎬',
    };
    return categoryName ? icons[categoryName] ?? '🏪' : '🏪';
  }

  getCategoryLabel(category: string): string {
    const labels: Record<string, string> = {
      mode: 'Mode',
      restauration: 'Restauration',
      electronique: 'Électronique',
      beaute: 'Beauté',
      services: 'Services',
      divertissement: 'Divertissement',
    };
    return labels[category] ?? category;
  }

  viewDetailsShop(shopId: string) {
    this.shopService.getShopById(shopId).subscribe({
      next: (data) => {
        this.selectedShop = data;

        this.shopService.getProductsByShop(shopId).subscribe({
          next: (productsData) => {
            this.products = productsData.map(p => ({
              ...p,
              price: Number(p.price),
              isFavorite: false
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

  closeModal(): void {
    this.selectedShop = null;
    this.products = [];
  }

  onOverlayClick(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    if (target.classList.contains('modal-overlay')) {
      this.closeModal();
    }
  }

  getInStockCount(): number {
    return this.products.filter(p => p.status === 'available').length;
  }

  getLowStockCount(): number {
    return this.products.filter(p => p.isLowStock).length;
  }

  addToCart(product: any): void {
    console.log('Ajout panier :', product);
  }

toggleFavorite(product: ProductUI) {
  if (!this.selectedShop) return;

  const payload = {
    userId: STATIC_USER_ID,
    productId: product._id,
    shopId: this.selectedShop._id
  };

  console.log('API toggleFavorite appelé avec :', payload);

  this.favoriteService.toggleFavorite(
    STATIC_USER_ID,
    product._id,
    this.selectedShop._id
  ).subscribe({
    next: (res) => {
      console.log('Réponse backend :', res);

      if (res && res.favoriteProducts) {
        // 🔹 Met à jour tous les produits de la boutique pour ce user
        this.products.forEach(p => {
          if (p.shopId === this.selectedShop?._id) {
            p.isFavorite = res.favoriteProducts.some(
              (f: any) => f.productId === p._id
            );
          }
        });
      }

      console.log('Produits après mise à jour des favoris :', this.products);
    },
    error: (err) => {
      console.error('Erreur toggle favorite :', err);
    }
  });
}

onProductAddedToCart(event: any) {
  console.log('Produit ajouté :', event.product);
  console.log('Panier mis à jour :', event.cart);
  alert(`Produit "${event.product.name}" ajouté au panier !`); // Simple alert pour feedback
  // Ou afficher notification
  // this.toastr.success('Produit ajouté au panier');
}

onRatingChanged(newRating: number, product: any) {
  const customerId = this.userId;

  this.productRatingService.rateProduct(product._id, customerId, newRating)
    .subscribe(res => {
      // stocke dans le dictionnaire, pas dans product
      this.avgRatings[product._id] = res.avgRating;
      this.totalVotes[product._id] = res.totalVotes;
    });
}

loadRatings: { [productId: string]: boolean } = {};

currentProductId: string | null = null;
totalVotes: { [productId: string]: number } = {};

showRatings(product: any) {
  console.log('📌 Clic sur Voir les avis pour', product._id);
  this.currentProductId = product._id;
}

}
