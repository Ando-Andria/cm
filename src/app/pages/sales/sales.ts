import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ProductService } from '../../services/products/product';
import { Customers } from '../../services/customer/customers';
import { SalesService } from '../../services/sales/sales';
import { SalesListComponent } from "../liste-ventes/liste-ventes";
import { ShopNavbarComponent } from "../navbar-boutique/navbar-boutique";
import { Footer } from '../footer/footer';


@Component({
  selector: 'app-sales',
  imports: [CommonModule, ReactiveFormsModule, SalesListComponent, ShopNavbarComponent, Footer],
  templateUrl: './sales.html',
  styleUrl: './sales.css',
})
export class SaleFormComponent implements OnInit {

  saleForm!: FormGroup;
  products: any[] = [];
  customers: any[] = [];
  shopId = '';
  loading = false;

  constructor(
    private fb: FormBuilder,
    private saleService: SalesService,
    private productService: ProductService,
    private customerService: Customers
  ) {}

  ngOnInit(): void {
     const storedShopId = localStorage.getItem('shopId');
    if (!storedShopId) {
      console.error('Aucun shopId trouvé, redirection vers login');
      return;
    }

    this.shopId = storedShopId;
    this.saleForm = this.fb.group({
      shopId: [this.shopId, Validators.required],
      customerId: [''],
      paymentMethod: ['Cash', Validators.required],
      products: this.fb.array([])
    });

    this.loadProducts();
    this.loadCustomers();

    // attendre que les produits soient chargés avant d'ajouter la première ligne
    this.productService.getProductsByShop(this.shopId).subscribe(data => {
      this.products = data;
      this.productsArray.push(this.createProductGroup()); // Ajoute un FormGroup valide
    });
  }

  // Créer un FormGroup pour un produit
  createProductGroup(): FormGroup {
    return this.fb.group({
      productId: ['', Validators.required],
      quantity: [1, [Validators.required, Validators.min(1)]]    });
  }

  // Getter pour accéder facilement au FormArray
  get productsArray(): FormArray {
    return this.saleForm.get('products') as FormArray;
  }

  addProduct() {
    this.productsArray.push(this.createProductGroup());
  }

  removeProduct(index: number) {
    if (this.productsArray.length > 1) {
      this.productsArray.removeAt(index);
    }
  }

loadProducts() {
  this.productService.getProductsByShop(this.shopId)
    .subscribe(data => {
      this.products = data;
      this.productsArray.push(this.createProductGroup());
      console.log('Produits chargés :', this.products);
    });
}

  loadCustomers() {
    this.customerService.getCustomersByShop()
      .subscribe(data => this.customers = data);
  }

  onSubmit() {
    if (this.saleForm.invalid) return;

     const confirmSave = window.confirm(
    '⚠️ Cette action est irréversible ! Êtes-vous sûr de vouloir enregistrer cette vente ?'
      );

      if (!confirmSave) {
        return;
      }

    this.loading = true;
    const saleData = {
      shopId: this.saleForm.value.shopId,
      customerId: this.saleForm.value.customerId,
      paymentMethod: this.saleForm.value.paymentMethod,
      products: this.productsArray.value.map((p: { productId: any; quantity: any; }) => ({
        productId: p.productId,
        quantity: p.quantity
      }))
    };
    console.log(JSON.stringify(saleData, null, 2));
    this.saleService.createSale(this.saleForm.value)
      .subscribe({
        next: res => {
          alert('Vente enregistrée avec succès');
          this.saleForm.reset({
            shopId: this.shopId,
            paymentMethod: 'Cash',
            products: [this.createProductGroup().value]
          });
          this.productsArray.clear();
          this.productsArray.push(this.createProductGroup());
          this.loading = false;
          this.saleService.notifyRefresh();
        },
        error: err => {
          this.loading = false;

      // ✅ Affiche le message précis du backend si disponible
      const backendMessage = err.error?.message || 'Erreur lors de l’enregistrement';

      // Option 1 : alert
      alert(backendMessage);
      console.error('Erreur création vente:', backendMessage);
        }
      });
  }
}
