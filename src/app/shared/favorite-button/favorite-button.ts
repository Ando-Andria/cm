import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule, NgIf } from '@angular/common';

@Component({
  selector: 'app-favorite-button',
  standalone: true,
  imports: [CommonModule, NgIf],
  templateUrl: './favorite-button.html',
  styleUrls: ['./favorite-button.css'],
})
export class FavoriteButton {

  @Input() isFavorite: boolean = false;
  @Output() toggled = new EventEmitter<void>();

  toggle() {
    this.toggled.emit();
    console.log('Toggle émis, nouvel état :', !this.isFavorite);
  }

}
