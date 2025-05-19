import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class LinksService {
  private storageKey = 'enlacesExternos';

  private defaultLinks = {
    'Telcel.com/Viajero': 'https://www.telcel.com/personas/roaming/paquetes-y-precios',
    'Guía Viajero': 'https://www.telcel.com/personas/roaming/paquetes-y-precios',
    'VoLTE': 'https://www.telcel.com/personas/la-red-de-mayor-cobertura/red-tecnologia/4g/volte',
    'SERTEC': 'http://serviciotecnico/r9/index.asp',
    'Cobertura': 'https://www.telcel.com/personas/roaming/cobertura#',
    'Preguntas Frecuentes': 'https://www.telcel.com/personas/roaming/estoy-en-el-extranjero-preguntas'
  };

  private links: Record<string, string>;

  constructor() {
    const almacenados = localStorage.getItem(this.storageKey);
    this.links = almacenados ? JSON.parse(almacenados) : this.defaultLinks;
  }

  getLink(nombre: string): string {
    return this.links[nombre] ?? '#';
  }

  getAllLinks(): Record<string, string> {
    return this.links;
  }

  updateLink(nombre: string, url: string): void {
    this.links[nombre] = url;
    localStorage.setItem(this.storageKey, JSON.stringify(this.links));
  }
}
