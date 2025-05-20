export interface ArchivoPaquete {
  id: string;
  titulo: string;
  descripcion: string;
  perfil: 'corporativo' | 'masivo';
  categoria: 'sms' | 'voz' | 'datos' | 'aereo';
  url: string;
  fecha: string;
}
