import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { UsuarioService } from '../../services/usuario.service';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-permiso-admin',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatSelectModule,
    MatTableModule,
    MatIconModule
  ],
  templateUrl: './permiso-admin.component.html',
  styleUrls: ['./permiso-admin.component.scss']
})
export class PermisoAdminComponent implements OnInit {
  columnas: string[] = ['username', 'rol'];
  usuarios: any[] = [];
  roles = ['superAdmin', 'admin', 'corporativo', 'masivo'];
  usuarioEnSesion: string | null = null;

  // ✅ Alerta personalizada tipo toast
  alerta: { tipo: 'success' | 'error', mensaje: string } | null = null;

  constructor(private usuarioService: UsuarioService) {}

  ngOnInit(): void {
    this.usuarioEnSesion = localStorage.getItem('usuario');
    this.usuarios = this.usuarioService
      .getUsuarios()
      .filter(u => u.username !== this.usuarioEnSesion)
      .map(u => ({
        ...u,
        nuevoRolPendiente: null,
        mostrarBotonConfirmar: false
      }));
  }

  onRolSeleccionado(user: any, nuevoRol: string): void {
    user.nuevoRolPendiente = nuevoRol;
    user.mostrarBotonConfirmar = true;
  }

  confirmarCambiosPendientes(): void {
    this.usuarios.forEach(user => {
      if (user.mostrarBotonConfirmar) {
        user.rol = user.nuevoRolPendiente;
        user.mostrarBotonConfirmar = false;
        this.usuarioService.actualizarRol(user.username, user.rol);
      }
    });

    this.mostrarAlerta('success', 'Cambios de rol aplicados correctamente.');
  }

  cancelarCambiosPendientes(): void {
    this.usuarios.forEach(user => {
      user.nuevoRolPendiente = null;
      user.mostrarBotonConfirmar = false;
    });
  }

  hayCambiosPendientes(): boolean {
    return this.usuarios.some(u => u.mostrarBotonConfirmar);
  }

  mostrarAlerta(tipo: 'success' | 'error', mensaje: string): void {
    this.alerta = { tipo, mensaje };
    setTimeout(() => this.alerta = null, 5000); // Puedes ajustar la duración o quitarla si quieres cierre manual
  }
}
