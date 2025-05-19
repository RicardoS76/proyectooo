import { Injectable } from '@angular/core';
import { Archivo } from '../models/archivo.model';

@Injectable({
  providedIn: 'root'
})
export class ArchivoService {

  private archivosPorCategoria = new Map<string, Archivo[]>([
    ['cci', [
      {
        nombre: 'Reporte_CCI_Abril.xlsx',
        categoria: 'cci',
        fechaSubida: new Date('2025-05-01'),
        tamanoMB: 1.8,
        usuario: 'cciUser',
        numeroControl: 'NC-1001',
        archivo: null
      }
    ]],
    ['cce', [
      {
        nombre: 'Estadisticas_CCE_Q1.xlsx',
        categoria: 'cce',
        fechaSubida: new Date('2025-04-15'),
        tamanoMB: 2.5,
        usuario: 'cceUser',
        numeroControl: 'NC-1002',
        archivo: null
      }
    ]],
    ['calidad', [
      {
        nombre: 'Auditoria_Interna_Marzo.xlsx',
        categoria: 'calidad',
        fechaSubida: new Date('2025-03-20'),
        tamanoMB: 3.2,
        usuario: 'auditorUser',
        numeroControl: 'NC-1003',
        archivo: null
      }
    ]]
  ]);

  constructor() {}

  subirArchivo(
    archivo: File,
    categoria: 'cci' | 'cce' | 'calidad',
    usuario: string,
    numeroControl: string
  ): string | null {
    const tamañoMB = archivo.size / (1024 * 1024);

    if (tamañoMB > 10) {
      return 'El archivo excede los 10 MB permitidos.';
    }

    const nuevo: Archivo = {
      nombre: archivo.name,
      categoria,
      fechaSubida: new Date(),
      tamanoMB: +tamañoMB.toFixed(2),
      usuario,
      numeroControl,
      archivo
    };

    const existentes = this.archivosPorCategoria.get(categoria) || [];
    existentes.push(nuevo);
    this.archivosPorCategoria.set(categoria, existentes);
    return null; // éxito
  }

  obtenerArchivos(categoria: 'cci' | 'cce' | 'calidad'): Archivo[] {
    return this.archivosPorCategoria.get(categoria) || [];
  }

  eliminarArchivo(categoria: 'cci' | 'cce' | 'calidad', nombre: string): void {
    const archivos = this.archivosPorCategoria.get(categoria);
    if (archivos) {
      const filtrados = archivos.filter(a => a.nombre !== nombre);
      this.archivosPorCategoria.set(categoria, filtrados);
    }
  }

  buscarPorNombre(categoria: 'cci' | 'cce' | 'calidad', nombreParcial: string): Archivo[] {
    const archivos = this.obtenerArchivos(categoria);
    return archivos.filter(a => a.nombre.toLowerCase().includes(nombreParcial.toLowerCase()));
  }

  limpiarCategoria(categoria: 'cci' | 'cce' | 'calidad'): void {
    this.archivosPorCategoria.set(categoria, []);
  }

  listarTodasLasCategorias(): string[] {
    return Array.from(this.archivosPorCategoria.keys());
  }

  contarArchivos(categoria: 'cci' | 'cce' | 'calidad'): number {
    return this.obtenerArchivos(categoria).length;
  }

  actualizarArchivo(
    categoria: 'cci' | 'cce' | 'calidad',
    nombreOriginal: string,
    archivoNuevo: File,
    usuario: string,
    numeroControl: string
  ): string | null {
    const tamañoMB = archivoNuevo.size / (1024 * 1024);
    if (tamañoMB > 10) {
      return 'El archivo nuevo excede los 10 MB permitidos.';
    }

    const archivos = this.archivosPorCategoria.get(categoria);
    if (!archivos) return 'No hay archivos en esta categoría.';

    const indice = archivos.findIndex(a => a.nombre === nombreOriginal);
    if (indice === -1) return 'Archivo original no encontrado.';

    const actualizado: Archivo = {
      nombre: archivoNuevo.name,
      categoria,
      fechaSubida: new Date(),
      tamanoMB: +tamañoMB.toFixed(2),
      usuario,
      numeroControl,
      archivo: archivoNuevo
    };

    archivos[indice] = actualizado;
    this.archivosPorCategoria.set(categoria, archivos);

    return null; // éxito
  }
}
