import { ProductService } from './../../services/products/product';
import { Component,ChangeDetectorRef } from '@angular/core';
import { Product } from '../../models/product';
import { CommonModule, NgFor, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ShopNavbarComponent } from '../navbar-boutique/navbar-boutique';
import { Router } from '@angular/router';
import { getAuthData } from '../../services/auth/auth.util';
import { Footer } from '../footer/footer';

@Component({
  selector: 'app-shop-products',
  imports: [CommonModule, NgIf, NgFor, FormsModule,ShopNavbarComponent, Footer],
  templateUrl: './shop-products.html',
  styleUrls: ['./shop-products.css'],
})
export class ShopProducts {

  shopId!: string;
  products: Product[] = [];
  loading = false;

  // Pour modal édition
  selectedProduct!: Product | null;
  isEditModalOpen = false;

  constructor(private productService: ProductService, private cdr: ChangeDetectorRef, private router: Router){}

  ngOnInit(){
   const authData = getAuthData(this.router);
    if (!authData) {
      console.log('Données manquantes');
      return;
    }
    this.loadProducts();
  }

  loadProducts() {

    this.loading = true;

    this.productService.getProductsByShop(this.shopId).subscribe({
      next: (data) => {
        this.products = data;
        console.log('Produits chargés', data);
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error(err);
        this.loading = false;
      }
    });
  }

  // Ouvrir la modal pré-remplie
  editProduct(product: Product) {
    this.selectedProduct = { ...product }; // copie pour éviter modif directe
    this.isEditModalOpen = true;
  }

  closeModal() {
    this.isEditModalOpen = false;
    this.selectedProduct = null;
  }

  submitUpdate() {
    if (!this.selectedProduct) return;

    // Appel service pour update
    this.productService.updateProduct(
      this.selectedProduct._id,
      {
        price: this.selectedProduct.price,
        stock: this.selectedProduct.stock,
        status: this.selectedProduct.status
      }
    ).subscribe({
      next: (updatedProduct) => {
        // mettre à jour la liste locale
        const index = this.products.findIndex(p => p._id === updatedProduct._id);
        if (index !== -1) this.products[index] = updatedProduct;

        this.closeModal();
      },
      error: (err) => console.error(err)
    });
  }

  // Supprimer produit
  deleteProduct(productId: string) {
    // if (!confirm('Supprimer ce produit ?')) return;

    // this.productService.deleteProduct(productId).subscribe({
    //   next: () => {
    //     this.products = this.products.filter(p => p._id !== productId);
    //   },
    //   error: (err) => console.error(err)
    // });
  }

}
