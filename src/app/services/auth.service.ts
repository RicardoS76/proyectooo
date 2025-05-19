import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private readonly usuarios = [
    { username: 'superAdmin', password: '1234', rol: 'superAdmin', numeroControl: 'NC-0001' },
    { username: 'admin', password: '5678', rol: 'admin', numeroControl: 'NC-0002' },
    { username: 'corporativo', password: '1111', rol: 'corporativo', numeroControl: 'NC-0003' },
    { username: 'masivo', password: '2222', rol: 'masivo', numeroControl: 'NC-0004' },
    { username: 'cciUser', password: '3333', rol: 'cci', numeroControl: 'NC-1001' },
    { username: 'cceUser', password: '4444', rol: 'cce', numeroControl: 'NC-1002' },
    { username: 'auditorUser', password: '5555', rol: 'auditor', numeroControl: 'NC-1003' },
  ];

  login(usuario: string, password: string): boolean {
    const match = this.usuarios.find(
      u => u.username === usuario && u.password === password
    );

    if (match) {
      localStorage.setItem('usuario', match.username);
      localStorage.setItem('rol', match.rol);
      localStorage.setItem('numeroControl', match.numeroControl);
      return true;
    }

    return false;
  }

  logout() {
    localStorage.removeItem('usuario');
    localStorage.removeItem('rol');
    localStorage.removeItem('numeroControl');
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('usuario');
  }

  getRol(): string | null {
    return localStorage.getItem('rol');
  }

getNumeroControl(): string | null {
  let numeroControl = localStorage.getItem('numeroControl');

  // Si falta el numeroControl pero sí hay usuario, lo restauramos
  if (!numeroControl) {
    const usuario = localStorage.getItem('usuario');
    const match = this.usuarios.find(u => u.username === usuario);

    if (match) {
      numeroControl = match.numeroControl;
      localStorage.setItem('numeroControl', numeroControl);
    }
  }

  return numeroControl;
}

restoreSession(): void {
  const usuario = localStorage.getItem('usuario');

  if (usuario) {
    const match = this.usuarios.find(u => u.username === usuario);
    if (match) {
      localStorage.setItem('rol', match.rol);
      localStorage.setItem('numeroControl', match.numeroControl);
    }
  }
}

}
