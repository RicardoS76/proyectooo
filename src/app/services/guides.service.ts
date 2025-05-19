import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Guide } from '../models/guide.model';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class GuidesService {

  constructor(private router: Router) { }

  getGuides(): Observable<Guide[]> {
    const guides: Guide[] = [
      {
        id: 1,
        title: 'SERTEC',
        description: 'Soporte técnico especializado para servicios internacionales.',
        image: 'assets/sd-web/images/slide1.png',
        link: 'http://serviciotecnico/r9/index.asp'
      },
      {
        id: 2,
        title: 'Guía Viajero',
        description: 'Todo lo necesario para viajar seguro.',
        image: 'assets/sd-web/images/slide2.png',
        link: '/404',
       // O actualizamos si tienes otra URL para la guía viajero
      },
      {
        id: 3,
        title: 'Paquete Viajero',
        description: 'Consulta paquetes de roaming internacional.',
        image: 'assets/sd-web/images/slide3.png',
        link: 'https://www.telcel.com/personas/roaming/paquetes-y-precios'
      },
      {
        id: 4,
        title: 'VoLTE',
        description: 'Mejora tu experiencia de llamadas.',
        image: 'assets/sd-web/images/slide1.png',
        link: 'https://www.telcel.com/personas/la-red-de-mayor-cobertura/red-tecnologia/4g/volte'
      }
    ];
    return of(guides);
  }
}
