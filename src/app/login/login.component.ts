import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  usuario = '';
  password = '';
  mensajeError = '';

  constructor(private authService: AuthService, private router: Router) {}

  login() {
    if (this.authService.login(this.usuario, this.password)) {
      // 🔵 Siempre redirigimos a /principal sin importar el rol
      this.router.navigate(['/principal']);
    } else {
      this.mensajeError = 'Usuario o contraseña incorrectos';
    }
  }
}
