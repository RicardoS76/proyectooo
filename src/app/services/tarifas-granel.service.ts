import { Injectable } from '@angular/core';

export interface TarifaGranelDocumento {
  id: string;
  titulo: string;
  descripcion: string;
  categoria: 'datos' | 'voz' | 'sms' | 'maritimo';
  archivo: string;
  fecha: string;
}

@Injectable({
  providedIn: 'root'
})
export class TarifasGranelService {
  bannerImagen = 'assets/sd-web/images/img-slider.png';

  private documentos: TarifaGranelDocumento[] = [
    {
      id: '1',
      titulo: 'Datos Prepago',
      descripcion: 'Tarifas a granel para datos prepago.',
      categoria: 'datos',
      archivo: 'assets/sd-web/docs/granel-datos-prepago.pdf',
      fecha: '2025-05-06'
    },
    {
      id: '2',
      titulo: 'Voz Internacional',
      descripcion: 'Tarifas de voz por volumen.',
      categoria: 'voz',
      archivo: 'assets/sd-web/docs/granel-voz.pdf',
      fecha: '2025-05-06'
    },
    {
      id: '3',
      titulo: 'SMS Masivo',
      descripcion: 'Tarifas de SMS a granel.',
      categoria: 'sms',
      archivo: 'assets/sd-web/docs/granel-sms.pdf',
      fecha: '2025-05-06'
    },
    {
      id: '4',
      titulo: 'Marítimo Aéreo',
      descripcion: 'Tarifas en zonas marítimas.',
      categoria: 'maritimo',
      archivo: 'assets/sd-web/docs/granel-maritimo.pdf',
      fecha: '2025-05-06'
    }
  ];

  getDocumentos(): TarifaGranelDocumento[] {
    return [...this.documentos];
  }

  getPorCategoria(categoria: 'datos' | 'voz' | 'sms' | 'maritimo'): TarifaGranelDocumento[] {
    return this.documentos.filter(d => d.categoria === categoria);
  }

  agregarDocumento(doc: Omit<TarifaGranelDocumento, 'id' | 'fecha'>): void {
    const nuevo: TarifaGranelDocumento = {
      ...doc,
      id: Date.now().toString(),
      fecha: new Date().toISOString().split('T')[0]
    };
    this.documentos.push(nuevo);
  }

  eliminarDocumento(id: string): void {
    this.documentos = this.documentos.filter(d => d.id !== id);
  }

  actualizarDocumento(docActualizado: TarifaGranelDocumento): void {
    const index = this.documentos.findIndex(d => d.id === docActualizado.id);
    if (index !== -1) {
      this.documentos[index] = { ...docActualizado };
    }
  }

  getBannerImagen(): string {
    return this.bannerImagen;
  }

  actualizarBannerImagen(url: string): void {
    this.bannerImagen = url;
  }
}
