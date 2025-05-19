import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-admin',
  standalone: true,
  template:` <h2>Bienvenido al panel de administración</h2>
    <p>Rol: {{ rol }}</p>
  `
})
export class AdminComponent {
  rol = '';

  constructor(private auth: AuthService, private router: Router) {
    this.rol = this.auth.getRol() || 'Desconocido';
  }

  logout() {
    this.auth.logout();
    this.router.navigate(['/login']);
  }
}
