export interface CarruselItem {
  id: number;
  titulo: string;
  descripcion: string;
  imagenUrl: string;
  fechaRegistro?: Date;
  fechaExpiracion?: Date | null;
  fechaExposicion?: Date | null;
  link?: string;
}
