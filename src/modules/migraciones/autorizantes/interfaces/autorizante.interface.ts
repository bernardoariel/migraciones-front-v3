export interface Autorizante {
  id?: number;
  nombre: string;
  apellido: string;
  segundo_apellido: string;
  otros_nombres: string;
  numero_de_documento: number;
  domicilio: string;
  sex_id: number;
  fecha_de_nacimiento: string;
  type_document_id: number;
  nationality_id: number;
  issuer_document_id: number;
}
