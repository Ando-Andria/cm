import { Component } from '@angular/core';
import { Dashboard } from '../../../pages/dashboard/dashboard';
import { ShopNavbarComponent } from '../navbar-boutique/navbar-boutique';
import { DashboardBoutique } from '../dashboard/dashboard';

@Component({
  selector: 'app-boutique-main',
  imports: [DashboardBoutique ,ShopNavbarComponent],
  templateUrl: './boutique-main.html',
  styleUrl: './boutique-main.css',
})
export class BoutiqueMain {

}
