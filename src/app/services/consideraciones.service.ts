import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { DocumentoConsideracion } from '../models/documento-consideracion.model';

// ✅ La constante se define FUERA de la clase
const DOCUMENTOS_CONSIDERACION_MOCK: DocumentoConsideracion[] = [
  {
    id: 1,
    nombre: 'Activación de Roaming',
    descripcion: 'Paso a paso para activar el roaming en dispositivos móviles.',
    fecha: '2025-05-10',
    archivoUrl: 'assets/sd-web/docs/Activacion_Roaming_CCI.pdf',
    perfil: 'cci'
  },
  {
    id: 2,
    nombre: 'Frecuencias Compatibles',
    descripcion: 'Revisión de bandas y frecuencias compatibles.',
    fecha: '2025-05-10',
    archivoUrl: 'assets/sd-web/docs/Frecuencias_Compatibles_CCE.pdf',
    perfil: 'cce'
  },
  {
    id: 3,
    nombre: 'Indicadores de Calidad',
    descripcion: 'Indicadores clave de calidad del servicio.',
    fecha: '2025-05-10',
    archivoUrl: 'assets/sd-web/docs/Indicadores_Calidad.pdf',
    perfil: 'calidad'
  },
  {
    id: 4,
    nombre: 'Procedimiento de Monitoreo',
    descripcion: 'Instrucciones para el monitoreo operativo.',
    fecha: '2025-05-10',
    archivoUrl: 'assets/sd-web/docs/Procedimiento_Monitoreo.pdf',
    perfil: 'monitoreo'
  },
  {
    id: 5,
    nombre: 'Guía General de Uso',
    descripcion: 'Documento general para todos los perfiles.',
    fecha: '2025-05-10',
    archivoUrl: 'assets/sd-web/docs/Guia_General_Uso.pdf',
    perfil: 'cci'
  }
];

@Injectable({ providedIn: 'root' })
export class ConsideracionesService {
  // ✅ declaramos documentos como propiedad interna
  private documentos: DocumentoConsideracion[] = [...DOCUMENTOS_CONSIDERACION_MOCK];
  private documentosSubject = new BehaviorSubject<DocumentoConsideracion[]>(this.documentos);

  constructor() {}

  getDocumentos(): Observable<DocumentoConsideracion[]> {
    return this.documentosSubject.asObservable();
  }

  agregarDocumento(nuevo: DocumentoConsideracion): void {
    this.documentos.push(nuevo);
    this.documentosSubject.next(this.documentos);
  }

  eliminarDocumento(id: number): void {
    this.documentos = this.documentos.filter(d => d.id !== id);
    this.documentosSubject.next(this.documentos);
  }

  actualizarDocumento(documentoActualizado: DocumentoConsideracion): void {
    const index = this.documentos.findIndex(d => d.id === documentoActualizado.id);
    if (index !== -1) {
      this.documentos[index] = documentoActualizado;
      this.documentosSubject.next(this.documentos);
    }
  }
}
