import type { Acompaneante } from '../../modules/migraciones/acompaneantes/interfaces/acompaneante.interface';
import type { Autorizante } from '../../modules/migraciones/autorizantes/interfaces/autorizante.interface';
import type { Menor } from '../../modules/migraciones/menores/interfaces/menor.interface';
import type { Solicitud } from '../../modules/migraciones/ordenes/interface/solicitud.interface';
export interface Orden {
  menor: Menor;
  autorizantes: Autorizante[];
  acompaneantes: Acompaneante[];
  solicitud: Solicitud;
}
