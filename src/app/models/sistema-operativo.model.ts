export interface SistemaOperativo {
  id: string;
  nombre: string;
  imagen?: string; // Base64 o URL
  instruccionesHTML: string;
}
