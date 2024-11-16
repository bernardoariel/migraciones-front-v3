import { apiClient } from '@/api/apiClient';
import type { ApiResponseDropdown } from '../interfaces/ApiResponseDropdown.interface';

export const fetchDropdownOptions = async <T>(
  endpoint: string,
): Promise<ApiResponseDropdown<T>[]> => {
  const response = await apiClient.get<ApiResponse<T>[]>(`/${endpoint}`);
  return response.data;
};
