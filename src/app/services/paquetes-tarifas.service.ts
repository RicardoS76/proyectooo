import { Injectable } from '@angular/core';

export interface TarifaDocumento {
  id: string;
  titulo: string;
  descripcion: string;
  perfil: 'corporativo' | 'masivo';
  categoria: 'sms' | 'voz' | 'datos' | 'maritimo-aereo';
  subcategoria?: 'prepago' | 'pospago' | 'controlado';
  archivo: string;
  fecha: string;
}

@Injectable({
  providedIn: 'root'
})
export class PaquetesTarifasService {
  private documentos: TarifaDocumento[] = [
    {
      id: '1',
      titulo: 'Corporativo - SMS',
      descripcion: 'Tarifas SMS para empresas y corporativos.',
      perfil: 'corporativo',
      categoria: 'sms',
      archivo: 'assets/sd-web/docs/tarifas-corporativo.pdf',
      fecha: '2025-05-05'
    },
    {
      id: '2',
      titulo: 'Masivo - SMS',
      descripcion: 'Tarifas SMS para usuarios masivos.',
      perfil: 'masivo',
      categoria: 'sms',
      archivo: 'assets/sd-web/docs/tarifas-sms.pdf',
      fecha: '2025-05-05'
    },
    {
      id: '3',
      titulo: 'Masivo - Datos Prepago',
      descripcion: 'Tarifas de datos para usuarios prepago.',
      perfil: 'masivo',
      categoria: 'datos',
      subcategoria: 'prepago',
      archivo: 'assets/sd-web/docs/tarifas-datos-prepago.pdf',
      fecha: '2025-05-05'
    },
    {
      id: '4',
      titulo: 'Masivo - Datos Pospago',
      descripcion: 'Tarifas de datos para usuarios pospago.',
      perfil: 'masivo',
      categoria: 'datos',
      subcategoria: 'pospago',
      archivo: 'assets/sd-web/docs/tarifas-datos-pospago.pdf',
      fecha: '2025-05-05'
    },
    {
      id: '5',
      titulo: 'Masivo - Datos Controlado',
      descripcion: 'Tarifas de datos para usuarios controlados.',
      perfil: 'masivo',
      categoria: 'datos',
      subcategoria: 'controlado',
      archivo: 'assets/sd-web/docs/tarifas-datos-controlado.pdf',
      fecha: '2025-05-05'
    },
    {
      id: '6',
      titulo: 'Masivo - Voz Pospago',
      descripcion: 'Tarifas de voz para usuarios pospago.',
      perfil: 'masivo',
      categoria: 'voz',
      subcategoria: 'pospago',
      archivo: 'assets/sd-web/docs/tarifas-voz-pospago.pdf',
      fecha: '2025-05-05'
    },
    {
      id: '7',
      titulo: 'Marítimo y Aéreo',
      descripcion: 'Tarifas aplicables en zonas marítimas y aéreas.',
      perfil: 'corporativo',
      categoria: 'maritimo-aereo',
      archivo: 'assets/sd-web/docs/tarifas-maritimo-aereo.pdf',
      fecha: '2025-05-05'
    },
    {
      id: '8',
      titulo: 'Corporativo - Voz',
      descripcion: 'Tarifas de voz para clientes corporativos.',
      perfil: 'corporativo',
      categoria: 'voz',
      archivo: 'assets/sd-web/docs/tarifas-voz-corporativo.docx',
      fecha: '2025-05-05'
    },
    {
      id: '9',
      titulo: 'Corporativo - Datos',
      descripcion: 'Tarifas de datos para clientes corporativos.',
      perfil: 'corporativo',
      categoria: 'datos',
      archivo: 'assets/sd-web/docs/tarifas-datos-corporativo.pdf',
      fecha: '2025-05-05'
    }
  ];

  getDocumentos(): TarifaDocumento[] {
    return [...this.documentos];
  }

  getDocumentosPorRutaCategoria(rutaCategoria: string): TarifaDocumento[] {
    const base = rutaCategoria.toLowerCase();

    if (base === 'maritimo-aereo') {
      return this.documentos.filter(d => d.categoria === 'maritimo-aereo');
    }

    if (base === 'sms') {
      return this.documentos.filter(d => d.categoria === 'sms' && d.perfil === 'corporativo');
    }

    if (base === 'sms-masivo') {
      return this.documentos.filter(d => d.categoria === 'sms' && d.perfil === 'masivo');
    }

    if (base === 'voz-corp') {
      return this.documentos.filter(d => d.categoria === 'voz' && d.perfil === 'corporativo');
    }

    if (base === 'voz-masivo') {
      return this.documentos.filter(d => d.categoria === 'voz' && d.perfil === 'masivo');
    }

    if (base === 'datos-corp') {
      return this.documentos.filter(d => d.categoria === 'datos' && d.perfil === 'corporativo');
    }

    if (base === 'datos-masivo') {
      return this.documentos.filter(d => d.categoria === 'datos' && d.perfil === 'masivo');
    }

    return [];
  }

  agregarDocumento(doc: Omit<TarifaDocumento, 'id' | 'fecha'>): void {
    const nuevo: TarifaDocumento = {
      ...doc,
      id: Date.now().toString(),
      fecha: new Date().toISOString().split('T')[0]
    };
    this.documentos.push(nuevo);
  }

  eliminarDocumento(id: string): void {
    this.documentos = this.documentos.filter(d => d.id !== id);
  }

  actualizarDocumento(docActualizado: TarifaDocumento): void {
    const index = this.documentos.findIndex(d => d.id === docActualizado.id);
    if (index !== -1) {
      this.documentos[index] = { ...docActualizado };
    }
  }
}
