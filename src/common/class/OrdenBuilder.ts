import { Orden } from '../interfaces/orden.interface';
import { Menor } from '../../modules/migraciones/menores/interfaces/menor.interface';
import { Acompaneante } from '../../modules/migraciones/acompaneantes/interfaces/acompaneante.interface';
export class OrdenBuilder {
  private orden: Orden;

  constuctor() {
    this.orden = {
      menor: null,
      autorizantes: [],
      acompaneantes: [],
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

  addAcompanenante(acompaneante: Acompaneante) {
    this.orden.acompaneante = acompaneante;
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
