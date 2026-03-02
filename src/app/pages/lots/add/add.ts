import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../../../shared/service/api.service';
import { ApiEndpoints } from '../../../shared/constants/api-endpoints';
import { Header } from '../../header/header';
@Component({
  selector: 'app-add-lot',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule,Header],
  templateUrl: './add.html',
  styleUrls: ['./add.css'],
})
export class AddLot implements OnInit {

  lotForm!: FormGroup;
  loading = false;
  showSuccess = false;
  errorMessage = '';

  modeEdition = false;
  lotId: string | null = null;

  constructor(
    private fb: FormBuilder,
    private api: ApiService,
    private route: ActivatedRoute,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {

    // Initialisation du formulaire
    this.lotForm = this.fb.group({
      numero: ['', Validators.required],
      surface: ['', [Validators.required, Validators.min(1)]],
      zone: ['', Validators.required],
      prix: ['', [Validators.required, Validators.min(0)]]
    });

    // Vérifier si on est en mode édition
    this.lotId = this.route.snapshot.paramMap.get('id');
    if (this.lotId) {
      this.modeEdition = true;
      this.loadLot(this.lotId);
    }

    this.cdr.detectChanges();
  }

  // Charger le lot existant pour pré-remplir le formulaire
  loadLot(id: string) {
    this.loading = true;
    this.api.getById(ApiEndpoints.LOTS.GETALL, id).subscribe({
      next: (lot: any) => {
        this.lotForm.patchValue({
          numero: lot.numero,
          surface: lot.surface,
          zone: lot.zone,
          prix: lot.prix
        });
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.errorMessage = 'Impossible de charger le lot';
      }
    });
  }

  onSubmit() {

    if (this.lotForm.invalid) {
      Object.values(this.lotForm.controls).forEach(control => control.markAsTouched());
      return;
    }

    this.loading = true;
    this.showSuccess = false;
    this.errorMessage = '';

    const data = {
      ...this.lotForm.value,
      statut: 'LIBRE'
    };

    // Modifier un lot existant
    if (this.modeEdition && this.lotId) {
      this.api.update(`${ApiEndpoints.LOTS.GETALL}${this.lotId}`, data).subscribe({
        next: () => {
          this.loading = false;
          this.showSuccess = true;
          setTimeout(() => this.router.navigate(['/lots']), 1500);
        },
        error: (err) => {
          this.loading = false;
          this.errorMessage = err.error?.message || 'Erreur lors de la modification';
        }
      });
    } 
    // Créer un nouveau lot
    else {
      this.api.create(ApiEndpoints.LOTS.CREATE, data).subscribe({
        next: () => {
          this.loading = false;
          this.showSuccess = true;
          this.lotForm.reset();
        },
        error: (err) => {
          this.loading = false;
          this.errorMessage = err.error?.message || 'Erreur lors de la création';
        }
      });
    }
  }
}