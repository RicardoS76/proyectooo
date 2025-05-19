export interface Notificacion {
  id: number;
  nombre: string;
  descripcion: string;
  fechaPublicacion: Date;
  archivoUrl: string;
  perfil: 'corporativo' | 'masivo';
}
