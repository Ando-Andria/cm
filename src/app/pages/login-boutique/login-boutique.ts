import { Component } from '@angular/core';
import { AuthService } from '../../services/auth/auth';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login-boutique',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login-boutique.html',
  styleUrl: './login-boutique.css',
})
export class LoginBoutique {

  email: string = 'techstorecT@gmail.com';
  password: string = '2a2abc52';
  loading: boolean = false;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

login() {
  console.log('🔹 login() appelé');
  this.loading = true;
  console.log('🔹 loader activé, email:', this.email, 'password:', this.password);

  this.authService.login(this.email, this.password)
    .subscribe({
      next: (res) => {
        console.log('✅ Réponse reçue du backend:', res);

        if (!res || !res.token) {
          console.error('⚠️ Aucun token reçu du backend');
          alert('Problème avec la réponse du serveur');
          this.loading = false;
          return;
        }

        console.log('🔹 Stockage du token et du shopId');
        localStorage.setItem('token', res.token);
        localStorage.setItem('shopId', res.boutiqueId);
        console.log('🔹 token et shopId stockés:',
                    localStorage.getItem('token'),
                    localStorage.getItem('shopId'));

        this.loading = false;
        console.log('🔹 loader désactivé, navigation vers /boutique/main');

        this.router.navigate(['/boutique/main']).then(() => {
          console.log('🔹 Navigation terminée vers /boutique/main');
        });
      },

      error: (err) => {
        console.error('❌ Erreur lors du login:', err);
        alert('Email ou mot de passe incorrect');
        this.loading = false;
      }
    });
}


}
