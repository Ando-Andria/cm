import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CartService } from '../../services/cart/cart';

@Component({
  selector: 'app-add-to-cart-button',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './add-to-cart-button.html',
  styleUrls: ['./add-to-cart-button.css']
})
export class AddToCartButtonComponent {

  @Input() product: any;
  @Input() shopId?: string;

  @Output() productAdded = new EventEmitter<any>();

  loading = false;

  constructor(private cartService: CartService) {}

  get clientId(): string {
    return '64b8c9e5f1a2c9b1d2e3f4a5'; 
  }

  add() {
    if (!this.product || !this.shopId) return;

    this.loading = true;

    const payload = {
      clientId: this.clientId,
      shopId: this.shopId,
      productId: this.product._id,
      quantity: 1
    };

    this.cartService.addToCart(payload).subscribe({
      next: (cart) => {
        this.loading = false;

        // 🔥 EMIT EVENT
        this.productAdded.emit({
          product: this.product,
          cart: cart
        });
      },
      error: () => {
        this.loading = false;
      }
    });
  }


}
