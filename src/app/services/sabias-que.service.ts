import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { SabiasQueDocumento } from '../models/sabias-que.model';

@Injectable({ providedIn: 'root' })
export class SabiasQueService {
private documentosMock: SabiasQueDocumento[] = [
  {
    id: 1,
    titulo: '¡Felicidades en tu activación!',
    descripcion: 'Descubre cómo iniciarte en Roaming con éxito.',
    categoria: 'comunicados',
    imagenUrl: 'assets/sd-web/images/AMT_felicidades.png',
    fecha: '2025-05-10',
    url: ''
  },
  {
    id: 2,
    titulo: '¿Cómo funciona el Roaming?',
    descripcion: 'Aprende los pasos básicos para conectar en el extranjero.',
    categoria: 'mes-anterior',
    imagenUrl: 'assets/sd-web/images/bg_jum_1.png',
    fecha: '2025-05-10',
    url: '/404'
  },
  {
    id: 3,
    titulo: 'Optimiza tu conexión',
    descripcion: 'Tips visuales para un mejor uso de redes móviles.',
    categoria: 'anio-2024',
    imagenUrl: 'assets/sd-web/images/comp1.png',
    fecha: '2025-05-10',
    url: '/404'
  },
  {
    id: 4,
    titulo: '¿Qué hacer si no tienes señal?',
    descripcion: 'Infografía de pasos para reconectar en Roaming.',
    categoria: 'comunicados',
    imagenUrl: 'assets/sd-web/images/element1.png',
    fecha: '2025-05-10',
    url: '/404'
  }
];


  private documentosSubject = new BehaviorSubject<SabiasQueDocumento[]>(this.documentosMock);

  // 🔵 Imagen del banner (valor por defecto)
  private bannerImagen = 'assets/sd-web/images/bg.png';

  constructor() {}

  // 📄 Obtener lista de documentos como observable
  getDocumentos(): Observable<SabiasQueDocumento[]> {
    return this.documentosSubject.asObservable();
  }

  agregarDocumento(nuevo: SabiasQueDocumento): void {
    this.documentosMock.push(nuevo);
    this.documentosSubject.next(this.documentosMock);
  }

  eliminarDocumento(id: number): void {
    this.documentosMock = this.documentosMock.filter(d => d.id !== id);
    this.documentosSubject.next(this.documentosMock);
  }

  actualizarDocumento(actualizado: SabiasQueDocumento): void {
    const index = this.documentosMock.findIndex(d => d.id === actualizado.id);
    if (index !== -1) {
      this.documentosMock[index] = actualizado;
      this.documentosSubject.next(this.documentosMock);
    }
  }

  // 🔧 Soporte para imagen del banner
  getBannerImagen(): string {
    return this.bannerImagen;
  }

  actualizarBannerImagen(url: string): void {
    this.bannerImagen = url;
  }
}
