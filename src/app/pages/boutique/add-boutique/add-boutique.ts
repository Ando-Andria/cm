import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../../../shared/service/api.service';
import { ApiEndpoints } from '../../../shared/constants/api-endpoints';
import { Header } from '../../header/header';

@Component({
  selector: 'app-add-boutique',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, Header],
  templateUrl: './add-boutique.html',
  styleUrls: ['./add-boutique.css']
})
export class AddBoutique implements OnInit {

  boutiqueForm!: FormGroup;
  categories: any[] = [];
  modeEdition = false;
  boutiqueId: string | null = null;
  loading = false;
  showSuccess = false;
  errorMessage = '';
loginInfo: { email: string; password: string } | null = null;
  constructor(
    private fb: FormBuilder,
    private api: ApiService,
    private route: ActivatedRoute,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    // ✅ Ajouter tous les champs manquants dans le FormGroup
    this.boutiqueForm = this.fb.group({
      nom: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      categorie: ['', Validators.required],
      responsableNom: ['', Validators.required],
      responsablePrenom: ['', Validators.required],
      responsableContact: ['', Validators.required],
      responsableCin: ['', Validators.required],
    });

    this.loadCategories();

    this.boutiqueId = this.route.snapshot.paramMap.get('id');
    if (this.boutiqueId) {
      this.modeEdition = true;
      this.loadBoutique(this.boutiqueId);
    }

    this.cdr.detectChanges();
  }

  loadCategories(): void {
    this.api.getList<any[]>(ApiEndpoints.CATEGORIES.GETALL).subscribe({
      next: data => this.categories = data,
      error: err => console.error('Erreur lors du chargement des catégories', err)
    });
  }

  loadBoutique(id: string): void {
    this.loading = true;
    this.api.getById(ApiEndpoints.BOUTIQUES.GETALL, id).subscribe({
      next: (b: any) => {
        this.boutiqueForm.patchValue({
          nom: b.nom,
          email: b.email,
          categorie: b.categorie?._id,
          responsableNom: b.responsable.nom,
          responsablePrenom: b.responsable.prenom,
          responsableContact: b.responsable.contact || '',
          responsableCin: b.responsable.cin || ''
        });
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.errorMessage = 'Impossible de charger la boutique';
      }
    });
  }

  onSubmit(): void {
    if (this.boutiqueForm.invalid) {
      Object.values(this.boutiqueForm.controls).forEach(c => c.markAsTouched());
      return;
    }

    const data = {
      nom: this.boutiqueForm.value.nom,
      email: this.boutiqueForm.value.email,
      categorie: this.boutiqueForm.value.categorie,
      responsable: {
        nom: this.boutiqueForm.value.responsableNom,
        prenom: this.boutiqueForm.value.responsablePrenom,
        contact: this.boutiqueForm.value.responsableContact,
        cin: this.boutiqueForm.value.responsableCin
      }
    };

    this.loading = true;
    this.showSuccess = false;
    this.errorMessage = '';

    if (this.modeEdition && this.boutiqueId) {
      this.api.update(`${ApiEndpoints.BOUTIQUES.GETALL}${this.boutiqueId}`, data).subscribe({
        next: () => {
          this.loading = false;
          this.showSuccess = true;
         this.router.navigate(['/boutiques']);
        },
        error: err => {
          this.loading = false;
          this.errorMessage = err.error?.message || 'Erreur lors de la modification';
        }
      });
    } else {
      this.api.create(ApiEndpoints.BOUTIQUES.CREATE, data).subscribe({
        next: (res: any) => {
    this.loading = false;
    this.showSuccess = true;
    this.boutiqueForm.reset();

    if (res.user) {
      this.loginInfo = {
        email: res.user.email,
        password: res.user.password
      };
    }
  },
        error: err => {
          this.loading = false;
          this.errorMessage = err.error?.message || 'Erreur lors de la création';
        }
      });
    }
  }
}