import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { BannerMessage } from '../models/banner-message.model';

@Injectable({
  providedIn: 'root'
})
export class BannerService {

  private mensajes: BannerMessage[] = [
    {
      id: 1,
      texto: 'Si tus Usuarios viajan a EUA, valida que su SIM y Equipo sean compatibles con la red del Operador'
    },
    {
      id: 2,
      texto: 'Consulta la cobertura y redes disponibles antes de viajar al extranjero.'
    },
    {
      id: 3,
      texto: 'Recuerda activar el Roaming antes de salir de México.'
    }
  ];

  constructor() {}

  /** Solo para PrincipalPage */
  getBannerMessage(): Observable<BannerMessage> {
    return of(this.mensajes[0]);
  }

  /** Para Consideraciones Admin */
  getAllBannerMessages(): Observable<BannerMessage[]> {
    return of(this.mensajes);
  }
}
