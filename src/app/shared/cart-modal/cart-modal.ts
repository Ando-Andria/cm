import { ChangeDetectorRef, Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CartService } from '../../services/cart/cart';
import { CartProduct } from '../../models/cart';


@Component({
  selector: 'app-cart-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cart-modal.html',
  styleUrls: ['./cart-modal.css']
})
export class CartModalComponent {

  @Input() clientId!: string;

  isOpen = false;
  carts: any[] = [];
  loading = false;
  totalItems = 0;

  constructor(private cartService: CartService, private cdr: ChangeDetectorRef) {}

  open() {
    if (!this.clientId) return;
    this.isOpen = true;
    this.loadCart();
  }

  close() {
    this.isOpen = false;
  }

loadCart() {
    console.log(`Début du chargement du panier pour clientId: ${this.clientId}`);
    this.loading = true;

    this.cartService.getCart(this.clientId).subscribe({
      next: (res) => {
        console.log('✅ Réponse reçue du service:', res);
        this.carts = [...(res.carts || [])]; // force Angular à détecter
        this.updateTotalItems();
        console.log('🛒 Panier mis à jour:', this.carts);
        this.loading = false;
        this.cdr.detectChanges();
        console.log('etat du loading après mise à jour:', this.loading);
        console.log('⏹️ Fin du chargement (succès)');
        console.log('🛒 Panier mis à jour:', this.carts);
        this.carts.forEach(cart => console.log('Products:', cart.products));
                this.cdr.detectChanges();

      },
      error: (err) => {
        console.error(err);
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }


 getCartTotal(products: any[]): number {
  const finalTotal =  products.reduce((sum, p) => sum + p.quantity * p.price, 0);
  console.log('Calcul du total pour les produits:', products);
  console.log('Total calculé:', finalTotal);
  return finalTotal;
  }

updateTotalItems() {
  this.totalItems = this.carts.reduce(
    (sum: number, cart: any) => sum + cart.products.reduce((s: number, p: any) => s + (p.quantity || 0), 0),
    0
  );
}

 updateProductQuantity(cartId: string, productId: string, quantity: number) {
    if (quantity < 1) return; // éviter 0 ou négatif
    this.cartService.updateCart(cartId, productId, quantity).subscribe({
      next: () => this.loadCart(),
      error: (err) => console.error(err)
    });
  }

  // Supprimer un produit du panier
  removeProduct(cartId: string, productId: string) {
    this.cartService.removeFromCart(cartId, productId).subscribe({
      next: () => this.loadCart(),
      error: (err) => console.error(err)
    });
  }

 checkoutCart(cartId: string) {
    if (!confirm('Voulez-vous vraiment passer la commande pour ce panier ?')) return;

    this.loading = true;
    this.cartService.checkoutCart(cartId).subscribe({
      next: (res) => {
        alert('Commande passée avec succès !');
        this.loadCart(); // recharge le panier pour afficher vide
      },
      error: (err) => {
        alert('Erreur lors du passage de la commande : ' + err.error?.error || err.message);
        this.loading = false;
      }
    });
  }


}
