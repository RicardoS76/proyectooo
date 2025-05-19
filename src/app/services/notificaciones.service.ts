import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Notificacion } from '../models/notificacion.model';

@Injectable({
  providedIn: 'root'
})
export class NotificacionesService {

  private notificaciones: Notificacion[] = [
    {
      id: 1,
      nombre: 'Tarifas de Roaming 2025',
      descripcion: 'Documento que presenta las tarifas actualizadas.',
      fechaPublicacion: new Date(),
      archivoUrl: 'assets/sd-web/docs/tarifas-roaming-2025.pdf',
      perfil: 'corporativo'
    },
    {
      id: 2,
      nombre: 'Guía Activación Datos',
      descripcion: 'Pasos para activar el servicio de datos en el extranjero.',
      fechaPublicacion: new Date(),
      archivoUrl: 'assets/sd-web/docs/documento_masivo.pdf',
      perfil: 'masivo'
    }
  ];

  private notificacionesSubject = new BehaviorSubject<Notificacion[]>(this.notificaciones);

  constructor() {}

  getNotificaciones(): Observable<Notificacion[]> {
    return this.notificacionesSubject.asObservable();
  }

  agregarNotificacion(nueva: Notificacion): void {
    this.notificaciones.push(nueva);
    this.notificacionesSubject.next([...this.notificaciones]); // 🔵 Forzamos la actualización
  }

  eliminarNotificacion(id: number): void {
    this.notificaciones = this.notificaciones.filter(n => n.id !== id);
    this.notificacionesSubject.next([...this.notificaciones]); // 🔵 Forzamos la actualización
  }

  actualizarNotificacion(notificacionActualizada: Notificacion): void {
    const index = this.notificaciones.findIndex(n => n.id === notificacionActualizada.id);
    if (index !== -1) {
      this.notificaciones[index] = notificacionActualizada;
      this.notificacionesSubject.next([...this.notificaciones]); // 🔵 Forzamos la actualización
    }
  }
}
