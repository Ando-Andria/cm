import { Component, HostListener, Input, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ChangeDetectorRef } from '@angular/core';
import { AuthService } from '../../services/auth/auth';

export interface NavItem {
  label: string;
  route: string;
  icon: string;
  children?: NavItem[];
}

@Component({
  selector: 'app-shop-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './navbar-boutique.html',
  styleUrls: ['./navbar-boutique.css'],
})
export class ShopNavbarComponent  {
isMenuOpen = signal(false);

  constructor(private authService : AuthService) {}


  toggleMenu() {
    this.isMenuOpen.update(v => !v);
  }

  closeMenu() {
    this.isMenuOpen.set(false);
  }

  navItems = [
    { label: 'Tableau de bord', route: '/dashboard', icon: 'dashboard' },
    { label: 'Catalogue Articles', route: '/catalogue', icon: 'inventory' },
    { label: 'Achats', route: '/achats', icon: 'shopping_cart' },
    { label: 'Saisie Ventes', route: '/ventes/saisie', icon: 'point_of_sale' },
    { label: 'Stocks Temps réel', route: '/stocks', icon: 'warehouse' },
    {
      label: 'Promotions',
      icon: 'local_offer',
      children: [
        { label: 'Proposer promotions', route: '/promotions/proposer', icon: 'add' },
        { label: 'Mise en avant client', route: '/promotions/affichage', icon: 'visibility' }
      ]
    },
    {
      label: 'Commandes',
      icon: 'receipt_long',
      children: [
        { label: 'Validation commandes', route: '/commandes/validation', icon: 'check_circle' },
        { label: 'MàJ Stock', route: '/commandes/maj-stock', icon: 'update' },
        { label: 'Suivi Livraison', route: '/commandes/livraison', icon: 'local_shipping' }
      ]
    },
    { label: 'Notifications', route: '/notifications', icon: 'notifications', badge: 'Nouveau' }
  ];

    onLogout() {
    this.authService.logout();
  }

}
