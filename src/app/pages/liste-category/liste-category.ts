import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, ElementRef, EventEmitter, Inject, OnInit, Output } from '@angular/core';
import { Category } from '../../models/category';
import { CategoriesService } from '../../services/category/categories';
import { Router } from '@angular/router';
import { DOCUMENT } from '@angular/core';


@Component({
  selector: 'app-liste-category',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './liste-category.html',
  styleUrl: './liste-category.css'
})
export class ListeCategory implements OnInit {
  @Output() close = new EventEmitter<void>();
  @Output() selectCategory = new EventEmitter<string>();

  categories: Category[] = [];
  loading = true;
  error: string | null = null;

  constructor(
    private el: ElementRef,
    @Inject(DOCUMENT) private document: Document,
    private categoriesService: CategoriesService,
    private router: Router,
    private cdr: ChangeDetectorRef // ← injecté pour forcer la détection
  ) {}

  ngOnInit(): void {
    this.categoriesService.getCategories().subscribe({
      next: (data) => {
        this.categories = data;
        this.loading = false;
        console.log('Catégories chargées :', this.categories);
        console.log('etat de loading enfant:', this.loading);
        this.cdr.detectChanges();
        this.document.body.appendChild(this.el.nativeElement); // Assure que le composant est au-dessus du plan du centre commercial
      },
      error: (err) => {
        console.error(err);
        this.error = 'Erreur lors du chargement des catégories';
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  ngOndestroy(): void {
    this.document.body.remove();
  }

  goToCategory(categoryId: string) {
    this.selectCategory.emit(categoryId);
  }

  closeList() {
    this.close.emit();
  }

  // ── Méthode à ajouter dans category-list.component.ts ────

// Icône selon le nom de la catégorie
// Adapte les clés aux vrais noms de tes catégories
getCatIcon(name: string): string {
  const map: Record<string, string> = {
    'mode':           '👗',
    'vêtements':      '👔',
    'restauration':   '🍽️',
    'café':           '☕',
    'electronique':   '💻',
    'high-tech':      '📱',
    'beauté':         '💄',
    'cosmétique':     '✨',
    'services':       '🏦',
    'banque':         '💳',
    'divertissement': '🎬',
    'loisirs':        '🎮',
    'sport':          '⚽',
    'librairie':      '📚',
    'bijouterie':     '💍',
    'maison':         '🛋️',
  };
  const key = name?.toLowerCase().trim();
  return map[key] ?? '🏪';
}

}
