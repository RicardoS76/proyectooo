import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class UsuarioService {
  private usuarios = [
    { username: 'superAdmin', rol: 'superAdmin' },
    { username: 'admin', rol: 'admin' },
    { username: 'corporativo', rol: 'corporativo' },
    { username: 'masivo', rol: 'masivo' }
  ];

  getUsuarios() {
    return this.usuarios;
  }

  actualizarRol(username: string, nuevoRol: string) {
    const usuario = this.usuarios.find(u => u.username === username);
    if (usuario) {
      usuario.rol = nuevoRol;
    }
  }
}
