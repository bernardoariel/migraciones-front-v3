import type { Acompaneante } from '../..migraciones/acompaneantes/interfaces/acompaneante.interface';
import type { Autorizante } from '../..migraciones/autorizantes/interfaces/autorizante.interface';
import type { Menor } from '../..migraciones/menores/interfaces/menor.interface';
import type { Solicitud } from '../..migraciones/ordenes/interface/solicitud.interface';
export interface Orden {
  menor: Menor | null;
  autorizantes: Autorizante[];
  acompaneantes: Acompaneante[];
  solicitud: Solicitud | null;
}
