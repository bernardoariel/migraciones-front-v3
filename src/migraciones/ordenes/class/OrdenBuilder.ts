import type { Orden } from '../interfaces/orden.interface';
import type { Menor } from '../..migraciones/menores/interfaces/menor.interface';
import type { Acompaneante } from '../..migraciones/acompaneantes/interfaces/acompaneante.interface';
import type { Solicitud } from '../..migraciones/ordenes/interface/solicitud.interface';

export class OrdenBuilder {
  private orden: Orden;

  constructor() {
    this.orden = {
      menor: null,
      autorizantes: [],
      acompaneantes: [],
      solicitud: null,
    };
  }

  setMenor(menor: Menor) {
    this.orden.menor = menor;
    return this;
  }

  addAutorizante(autorizante: Autorizante) {
    this.orden.autorizante = autorizante;
    return this;
  }

  addAcompaneante(acompaneante: Acompaneante) {
    this.orden.acompaneante = acompaneante;
    return this;
  }

  setSolicitud(solicitud: Solicitud) {
    this.orden.solicitud = solicitud;
    return this;
  }

  build() {
    if (!this.orden.menor) {
      throw new Error('Debe agregar al menos un menor');
    }
    if (this.orden.autorizantes.length < 1) {
      throw new Error('Debe agregar al menos un autorizante');
    }
    return this.orden;
  }
}
