export interface NotarioResponse {
  id: number | null;
  nombre: string;
  apellido: string;
  matricula: string;
  email: string;
  password: string;
  tipo: string;
  habilitado: 'Habilitado' | 'Deshabilitado';
  created_at: Date;
  updated_at: Date;
}
