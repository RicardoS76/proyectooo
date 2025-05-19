export interface DocumentoConsideracion {
  id: number;
  nombre: string;
  descripcion: string;
  fecha: string; // ISO format string (e.g. '2025-05-10')
  archivoUrl: string;
  perfil: 'cci' | 'cce' | 'calidad' | 'monitoreo';
}
