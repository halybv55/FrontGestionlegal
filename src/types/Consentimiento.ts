export interface Consentimiento {
  codigo: string;
  tipoTratamiento: string;
  descripcion: string;
  fecha: string;
  firmado: boolean;
  nombreFirmante: string;
  parentescoFirmante: string;
}