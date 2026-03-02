import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { PromotionService } from '../../services/promotions/promotion';
import { ProductService } from '../../services/products/product';
import { CommonModule } from '@angular/common';
import { ListPromotions } from '../list-promotions/list-promotions';
import { ShopNavbarComponent } from '../navbar-boutique/navbar-boutique';
import { Footer } from '../footer/footer';

@Component({
  selector: 'app-create-promotions',
  imports: [CommonModule,ReactiveFormsModule, ListPromotions, ShopNavbarComponent, Footer],
  templateUrl: './create-promotions.html',
  styleUrl: './create-promotions.css',
})
export class PromotionFormComponent implements OnInit {

  promotionForm!: FormGroup;
  loading = false;
  products: any[] = [];
  shopId = '';
  promotions: any[] = [];

  constructor(
    private fb: FormBuilder,
    private promoService: PromotionService,
    private productService: ProductService,
    private cdr: ChangeDetectorRef
  ) {}


// ngOnInit(): void {
//    const storedShopId = localStorage.getItem('shopId');
//     if (!storedShopId) {
//       console.error('Aucun shopId trouvé, redirection vers login');
//       // ici tu peux faire : this.router.navigate(['/login']); si Router injecté
//       return;
//     }

//     this.shopId = storedShopId;
//   // Charger les produits avant de créer le formulaire
//   this.productService.getProductsByShop(this.shopId).subscribe(products => {
//     this.products = products || [];

//     // Maintenant que les produits sont chargés, créer le formulaire
//     this.promotionForm = this.fb.group({
//       productId: ['', Validators.required],
//       title: ['', [Validators.required, Validators.maxLength(100)]],
//       description: [''],
//       discountPercent: [0, [Validators.required, Validators.min(1), Validators.max(100)]],
//       startDate: ['', Validators.required],
//       endDate: ['', Validators.required],
//       shopId: [this.shopId, Validators.required]
//     });

//     this.loadPromotions();
//   });
// }
ngOnInit(): void {
  const storedShopId = localStorage.getItem('shopId');
  if (!storedShopId) {
    console.error('Aucun shopId trouvé, redirection vers login');
    return;
  }

  this.shopId = storedShopId;

  // ✅ Créer le formulaire tout de suite
  this.promotionForm = this.fb.group({
    productId: ['', Validators.required],
    title: ['', [Validators.required, Validators.maxLength(100)]],
    description: [''],
    discountPercent: [0, [Validators.required, Validators.min(1), Validators.max(100)]],
    startDate: ['', Validators.required],
    endDate: ['', Validators.required],
    shopId: [this.shopId, Validators.required]
  });

  // Charger les produits ensuite
  this.productService.getProductsByShop(this.shopId).subscribe(products => {
    this.products = products || [];
    this.loadPromotions();
  });
}


  loadProducts() {
    this.productService.getProductsByShop(this.shopId)
      .subscribe(data => this.products = data);
  }

  confirming = false;

showConfirmModal() {
  this.confirming = true;
}

  confirmSave() {
    this.confirming = false;
    this.onSubmit(); // ici tu mets la logique de sauvegarde
  }

  cancelSave() {
    this.confirming = false;
  }


onSubmit() {
  if (this.promotionForm.invalid) return;
  const { startDate, endDate } = this.promotionForm.value;
  if (new Date(startDate) > new Date(endDate)) {
    alert('La date de début ne peut pas être après la date de fin !');
    return;
  }

  this.loading = true;

  this.promoService.createPromotion(this.promotionForm.value)
    .subscribe({
      next: res => {
        alert('Promotion enregistrée avec succès !');
        this.promotionForm.reset({ shopId: this.shopId, discountPercent: 0 });
        this.promoService.notifyRefresh();
        this.loading = false;
      },
      error: err => {
        console.error(err);
        alert('Erreur lors de l’enregistrement de la promotion.');
        this.loading = false;
      }
    });
}

loadPromotions() {
  this.promoService.getPromotionsByShop(this.shopId)
    .subscribe({
      next: (data) => this.promotions = data, // ⚡ Remplace complètement le tableau
      error: (err) => console.error('Erreur récupération promotions', err)
    });
    this.cdr.detectChanges();
}

}
