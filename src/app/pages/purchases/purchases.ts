import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { PurchaseService } from '../../services/purchase/purchase';
import { SupplierService } from '../../services/purchase/supplier';
import { ProductService } from '../../services/products/product';
import { PurchasesList } from "../purchases-list/purchases-list";
import { ShopNavbarComponent } from '../navbar-boutique/navbar-boutique';
import { Subject } from 'rxjs';
import { Footer } from '../footer/footer';

@Component({
  selector: 'app-purchases',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, PurchasesList, ShopNavbarComponent, Footer],
  templateUrl: './purchases.html',
  styleUrls: ['./purchases.css'],
})
export class PurchaseFormComponent implements OnInit {

  purchaseForm!: FormGroup;
  loading = false;
  suppliers: any[] = [];
  products: any[] = [];
  shopId = '';

  showConfirmModal = false;  // Pour afficher la modal de confirmation
  showSuccess = false;       // Pour afficher le message de succès

  constructor(
    private fb: FormBuilder,
    private purchaseService: PurchaseService,
    private productService: ProductService,
    private supplierService: SupplierService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
     const storedShopId = localStorage.getItem('shopId');
    if (!storedShopId) {
      console.error('Aucun shopId trouvé, redirection vers login');
      return;
    }

    this.shopId = storedShopId;
    this.purchaseForm = this.fb.group({
      shopId: [this.shopId || '', Validators.required],
      supplierId: ['', Validators.required],
      productId: ['', Validators.required],
      quantity: [1, [Validators.required, Validators.min(1)]],
      purchasePrice: [0, [Validators.required, Validators.min(0)]],
      date: [new Date().toISOString().split('T')[0], Validators.required]
    });

    this.loadSuppliers();
    this.loadProducts();
    this.cdr.detectChanges();

  }

loadSuppliers() {
  this.supplierService.getSuppliers()
    .subscribe(data => {
      this.suppliers = data;
      this.cdr.detectChanges(); // Force Angular à vérifier à nouveau
    });
}

  loadProducts() {
    this.productService.getProductsByShop(this.shopId)
      .subscribe(data => this.products = data);
  }

  // 1️⃣ Quand on clique sur "Enregistrer" → on affiche la modal de confirmation
  onSubmit() {
    console.log('Validation du formulaire...');

    if (this.purchaseForm.invalid) {
      console.log('FORMULAIRE INVALIDE');
      console.log(this.purchaseForm.controls);
      // Marquer tous les champs comme touchés pour afficher les erreurs
      Object.keys(this.purchaseForm.controls).forEach(key => {
        this.purchaseForm.get(key)?.markAsTouched();
      });
      return;
    }

    // Afficher la modal de confirmation
    this.showConfirmModal = true;
  }

  // 2️⃣ Si l'utilisateur confirme → on enregistre vraiment
  confirmSubmit() {
    console.log('Confirmation de l\'enregistrement...');
    console.log('DATA ENVOYÉE :', this.purchaseForm.value);

    this.loading = true;

    this.purchaseService.createPurchase(this.purchaseForm.value)
      .subscribe({
        next: (res) => {
          console.log('REPONSE SERVEUR :', res);

          this.loading = false;
          this.showConfirmModal = false;  // Fermer la modal
          this.showSuccess = true;         // Afficher le message de succès

          // Réinitialiser le formulaire
          this.purchaseForm.reset({
            shopId: this.shopId,
            quantity: 1,
            purchasePrice: 0,
            date: new Date().toISOString().split('T')[0]
          });
          this.purchaseService.notifyRefresh();

          // Masquer le message de succès après 3 secondes
          setTimeout(() => {
            this.showSuccess = false;
          }, 3000);
        },
        error: (err) => {
          console.error('ERREUR SERVEUR :', err);
          alert('Erreur lors de l\'enregistrement : ' + (err.error?.message || err.message));
          this.loading = false;
          this.showConfirmModal = false;  // Fermer la modal en cas d'erreur
        }
      });
  }

  // 3️⃣ Si l'utilisateur annule → on ferme juste la modal
  cancelSubmit() {
    console.log('Annulation de l\'enregistrement');
    this.showConfirmModal = false;
  }

  // 4️⃣ Méthodes helper pour afficher les noms dans la modal de confirmation
  getSupplierName(id: string): string {
    if (!id) return '';
    const supplier = this.suppliers.find(s => s._id === id);
    return supplier ? supplier.name : '';
  }

  getProductName(id: string): string {
    if (!id) return '';
    const product = this.products.find(p => p._id === id);
    return product ? product.name : '';
  }


}
