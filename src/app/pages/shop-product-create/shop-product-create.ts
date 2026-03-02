import { CategoriesService } from './../../services/category/categories';
import { Component } from '@angular/core';
import { ProductService } from './../../services/products/product';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductCreate } from '../../models/product';
import { ShopNavbarComponent } from '../navbar-boutique/navbar-boutique';
import { getAuthData } from '../../services/auth/auth.util';
import { Router } from '@angular/router';
import { Footer } from '../footer/footer';


interface Category {
  _id: string;
  name: string;
}


@Component({
  selector: 'app-shop-product-create',
  imports: [CommonModule, FormsModule, ShopNavbarComponent, Footer],
  templateUrl: './shop-product-create.html',
  styleUrls: ['./shop-product-create.css'],
})
export class ShopProductCreate {

  // Champs du formulaire
  name = '';
  description = '';
  price!: number;
  stock = 0;
  status: 'available' | 'inactive' | 'sold_out' | 'promo' | 'out_of_stock' = 'available';
  categoryId = ''; // ID statique pour l’instant
  imageUrl = '';

  shopId: string = localStorage.getItem('shopId') || '';

  loading = false;

   categories: Category[] = []; // liste dynamique

  constructor(private productService: ProductService, private categoriesService : CategoriesService, private router: Router) {}

  ngOnInit(){
  const authData = getAuthData(this.router);
    if (!authData) {
      console.log('Données manquantes');
      return;
    }
    this.loadCategories();
  }

   loadCategories() {
    this.categoriesService.getCategories().subscribe({
      next: (data) => this.categories = data,
      error: (err) => console.error(err)
    });
  }


  submitForm() {
    if (!this.name || !this.price || !this.categoryId) {
      alert('Nom, prix et catégorie requis');
      return;
    }

    // Correct : déclarer productData avec type ProductCreate
    const productData: ProductCreate = {
      name: this.name,
      description: this.description,
      price: this.price,
      stock: this.stock,
      status: this.status,
      categoryId: this.categoryId,
      shopId: this.shopId,
      imageUrl: this.imageUrl
    };

    this.loading = true;

    this.productService.createProduct(productData).subscribe({
      next: (newProduct) => {
        console.log('Produit créé', newProduct);
        this.loading = false;
        // Reset formulaire
        this.name = '';
        this.description = '';
        this.price = 0;
        this.stock = 0;
        this.status = 'available';
        this.categoryId = '';
        this.imageUrl = '';
        alert('Produit créé avec succès');
      },
      error: (err) => {
        console.error(err);
        this.loading = false;
        alert('Erreur lors de la création');
      }
    });
  }
}
