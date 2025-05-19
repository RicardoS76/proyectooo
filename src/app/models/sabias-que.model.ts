export interface SabiasQueDocumento {
  id: number;
  titulo: string;
  descripcion: string;
  fecha: string;
  imagenUrl: string;
  categoria: 'comunicados' | 'mes-anterior' | 'anio-2024';
  url?: string;
}
