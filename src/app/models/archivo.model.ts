export interface Archivo {
  nombre: string;
  categoria: 'cci' | 'cce' | 'calidad';
  fechaSubida: Date;
  tamanoMB: number; // ← cambiado aquí
  usuario: string;
  numeroControl: string;
  archivo: File | null;
}
