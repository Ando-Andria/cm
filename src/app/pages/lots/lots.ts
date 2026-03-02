import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../shared/service/api.service';
import { ApiEndpoints } from '../../shared/constants/api-endpoints';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { Router } from '@angular/router';
import { Header } from "../header/header";
export interface Lot {
  _id?: string;
  numero: string;
  surface: number;
  zone: string;
  statut?: 'LIBRE' | 'OCCUPE' | 'FERME';
  prix: number;
}

@Component({
  selector: 'app-lots',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule, Header],
  templateUrl: './lots.html',
  styleUrls: ['./lots.css']
})
export class Lots implements OnInit {

  lots: Lot[] = [];           // tous les lots
  filteredLots: Lot[] = [];   // lots filtrés pour la recherche
  searchTerm: string = '';    // terme de recherche

  totalLots = 0;
  availableLots = 0;
  occupiedLots = 0;

  constructor(private apiService: ApiService,
     private router: Router
  ) { }

  ngOnInit(): void {
    this.loadLots();
  }
goToEditLot(lotId: string) {
  this.router.navigate(['/lots/add', lotId]);
}
  loadLots(): void {
    this.apiService.getList<Lot[]>(ApiEndpoints.LOTS.GETALL).subscribe({
      next: (data) => {
        this.lots = data;
        this.filteredLots = data; // initialement tout afficher
        this.calculateStats();
      },
      error: (err) => console.error('Erreur lors du chargement des lots :', err)
    });
  }

  // 🔹 Calcul des stats
  calculateStats(): void {
    this.totalLots = this.lots.length;
    this.availableLots = this.lots.filter(l => l.statut === 'LIBRE').length;
    this.occupiedLots = this.lots.filter(l => l.statut === 'OCCUPE').length;
  }

  onSearch(): void {
    const term = this.searchTerm.trim().toLowerCase();
    if (!term) {
      this.filteredLots = this.lots;
    } else {
      this.filteredLots = this.lots.filter(l => l.numero.toLowerCase().includes(term));
    }
  }

  deleteLot(id: string): void {
    if (confirm("Voulez-vous vraiment supprimer ce lot ?")) {
      this.apiService.delete(`${ApiEndpoints.LOTS.GETALL}`, id).subscribe({
        next: () => {
          alert("Lot supprimé !");
          this.loadLots();
        },
        error: (err) => console.error('Erreur lors de la suppression :', err)
      });
    }
  }

}