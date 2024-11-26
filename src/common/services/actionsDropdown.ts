import { apiMigrationsData } from '@/api/apiMigrationsData';
import type { ApiResponseDropdown } from '../interfaces/ApiResponseDropdown.interface';
export const fetchDropdownOptions = async <T>(
  endpoint: string,
): Promise<ApiResponseDropdown<T>[]> => {
  const response = await apiMigrationsData.get<ApiResponse<T>[]>(`/${endpoint}`);
  return response.data;
};