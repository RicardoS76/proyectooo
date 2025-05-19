import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { CarruselItem } from '../models/carrusel-item.model';

@Injectable({
  providedIn: 'root'
})
export class CarruselService {

  constructor() {}

  getCarruselItems(): Observable<CarruselItem[]> {
    const items: CarruselItem[] = [
      {
        id: 1,
        titulo: 'Viaja Conectado',
        descripcion: 'Activa tus datos en Roaming Internacional con Telcel',
        imagenUrl: 'assets/sd-web/images/slide1.png',
        fechaRegistro: new Date('2024-05-01'),
        fechaExpiracion: new Date('2025-12-31'),
        fechaExposicion: new Date('2025-01-01'),
        link: '/404' // ⛔ redirección a página no encontrada
      },
      {
        id: 2,
        titulo: 'Nuevas Tarifas',
        descripcion: 'Consulta las tarifas de roaming actualizadas para tu país de destino',
        imagenUrl: 'assets/sd-web/images/slide2.png',
        fechaRegistro: new Date('2024-06-15'),
        fechaExpiracion: new Date('2025-12-31'),
        fechaExposicion: new Date('2025-05-01'),
        link: '/404'
      },
      {
        id: 3,
        titulo: 'Cobertura Mundial',
        descripcion: 'Consulta la cobertura internacional de Telcel en más de 190 países',
        imagenUrl: 'assets/sd-web/images/slide3.png',
        fechaRegistro: new Date('2024-07-10'),
        fechaExpiracion: new Date('2025-12-31'),
        fechaExposicion: new Date('2025-06-01'),
        link: '/404'
      }
    ];
    return of(items);
  }
}
