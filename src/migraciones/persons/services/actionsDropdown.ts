import { apiMigrationsData } from '@/api/apiMigrationsData';
import type { ApiResponseDropdown } from '../../../common/interfaces/ApiResponseDropdown.interface';

export const fetchDropdownOptions = async <T>(
  endpoint: string,
): Promise<ApiResponseDropdown<T>[]> => {
  console.log('endpoint::: ', endpoint);
  const response = await apiMigrationsData.get<ApiResponse<T>[]>(`/${endpoint}`);
  console.log(`${endpoint}`, response);
  return response.data;
};
