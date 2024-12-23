export interface Solicitud {
  dateOfEnd: string;
  dateOfInit: string;
  dateOfInstrumento: string;
  instrumentoType: 'P' | 'D';
  mayoriaEdad: 'y' | 'n';
  numeroActuacion: string;
  paisDescripcion: string;
  paisType: 'y' | 'n';
}
