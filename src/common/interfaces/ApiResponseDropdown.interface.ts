export interface ApiResponseDropdown<T = any> {
    id: number;
    codigo: string;
    descripcion: string;
    created_at: string;
    updated_at: string;
    [key: string]: T;
}