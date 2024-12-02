export interface OrdenSolicitud {
  id: number;
  notary_id: number;
  minor_id: number;
  aprobacion: string | null;
  numero_actuacion_notarial_cert_firma: string;
  fecha_del_instrumento: string;
  cualquier_pais: string;
  serie_foja: string;
  tipo_foja: string;
  vigencia_hasta_mayoria_edad: string;
  fecha_vigencia_desde: string;
  fecha_vigencia_hasta: string;
  instrumento: string;
  nro_foja: string;
  paises_desc: string;
  created_at: string;
  updated_at: string;
  apellido: string;
  segundo_apellido: string;
  nombre: string;
  otros_nombres: string;
  documento: string;
  apellidoescribano: string;
  nombreescribano: string;
}
