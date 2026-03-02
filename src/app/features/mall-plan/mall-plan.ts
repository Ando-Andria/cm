import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-mall-plan',
  imports: [CommonModule],
  templateUrl: './mall-plan.html',
  styleUrl: './mall-plan.css',
})
export class MallPlan {
  @Output() close = new EventEmitter<void>();

  planImageUrl = 'https://www.siliconcentral.ae/media/2689/sc-ground-floor.jpg';
  closeModal() {
    this.close.emit();
  }

openFullscreen(): void {
  window.open(this.planImageUrl, '_blank');
}

downloadPlan(): void {
  const a = document.createElement('a');
  a.href = this.planImageUrl;
  a.download = 'plan-centre-commercial.jpg';
  a.target = '_blank'; 
  a.click();
}



}
