import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Favorite } from '../../services/favorites/favorite';
import { FavoriteButton } from '../../shared/favorite-button/favorite-button';

// Interfaces pour typer les favoris
interface ProductUI {
  _id: string;
  name: string;
  description: string;
  price: number;
  imageUrl?: string;
  isFavorite?: boolean;
  [key: string]: any; // pour les autres propriétés du backend
}

interface ShopFavorite {
  shop: {
    _id: string;
    name: string;
    imageUrl?: string;
    unitNumber?: string;
    floor?: number;
    [key: string]: any;
  };
  products: ProductUI[];
}

@Component({
  selector: 'app-user-favorites',
  standalone: true,
  imports: [CommonModule, FavoriteButton],
  templateUrl: './user-favorites.html',
  styleUrls: ['./user-favorites.css'],
})
export class UserFavorites implements OnInit {

  favorites: ShopFavorite[] = [];
  showModal = false;
  userId = '64b8c9e5f1a2c9b1d2e3f4a5'; // futur: récupérer depuis session/login

  constructor(private favoriteService: Favorite) {}

  ngOnInit() {
    this.loadFavorites();
  }

  openModal() {
    this.showModal = true;
    this.loadFavorites();
  }

  closeModal() {
    this.showModal = false;
  }

  loadFavorites() {
    this.favoriteService.getFavorites(this.userId).subscribe({
      next: (res) => {
        console.log('Favoris reçus du backend:', res);
        // typage des favoris et ajout du champ isFavorite
        this.favorites = res.favorites.map((fav: ShopFavorite) => ({
          shop: fav.shop,
          products: fav.products.map((p: ProductUI) => ({ ...p, isFavorite: true }))
        }));
      },
      error: (err) => console.error('Erreur récupération favoris:', err),
    });
  }

  toggleFavorite(shopId: string, product: ProductUI) {
    this.favoriteService.toggleFavorite(this.userId, product._id, shopId).subscribe({
      next: (res) => {
        // Met à jour isFavorite selon la réponse backend
        product.isFavorite = res.favoriteProducts.some((f: any) => f.productId === product._id);

        console.log(`Produit ${product._id} est favori ?`, product.isFavorite);

        // Si le produit n'est plus favori, on peut le retirer de la liste
        if (!product.isFavorite) {
          const shop = this.favorites.find((s) => s.shop._id === shopId);
          if (shop) {
            shop.products = shop.products.filter((p) => p._id !== product._id);
          }
        }
      },
      error: (err) => console.error('Erreur toggle favori:', err),
    });
  }
}
