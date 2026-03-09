import type {
  CategoryCreateDTO,
  CategoryFilterDTO,
  CategoryResponseDTO,
  CategoryUpdateDTO,
  HTTPErrorResponse,
} from '@fokus/shared';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import api from '../../config/api.config';

interface UseCategoryQueriesParams {
  categoryId?: string;
  filter?: CategoryFilterDTO;
}

export function useCategoryQueries(query: UseCategoryQueriesParams) {
  const idQuery = useQuery<CategoryResponseDTO, HTTPErrorResponse>({
    queryKey: ['category', query.categoryId],
    queryFn: async () => {
      const response = await api.get(`/categories/${query.categoryId}`, {
        withCredentials: true,
      });
      return response.data;
    },
    refetchOnWindowFocus: false,
    retry: 3,
    enabled: !!query.categoryId,
  });

  const filterQuery = useQuery<CategoryResponseDTO[], HTTPErrorResponse>({
    queryKey: ['categories', query.filter],
    queryFn: async () => {
      const response = await api.get('/categories', {
        withCredentials: true,
        params: query.filter,
      });
      return response.data;
    },
    refetchOnWindowFocus: false,
    retry: 3,
    enabled: !!query,
  });

  return { idQuery, filterQuery };
}

export function useCategoryMutations() {
  const queryClient = useQueryClient();

  const createMutation = useMutation<
    CategoryResponseDTO,
    HTTPErrorResponse,
    CategoryCreateDTO
  >({
    mutationFn: async (data) => {
      const response = await api.post('/categories', data, {
        withCredentials: true,
      });
      return response.data;
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['categories'] });
    },
  });

  const updateMutation = useMutation<
    CategoryResponseDTO,
    HTTPErrorResponse,
    { categoryId: string; newData: CategoryUpdateDTO }
  >({
    mutationFn: async ({ categoryId, newData }) => {
      const response = await api.patch(`/categories/${categoryId}`, newData, {
        withCredentials: true,
      });
      return response.data;
    },
    onSuccess: async (_, variables) => {
      const { categoryId } = variables;
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['category', categoryId] }),
        queryClient.invalidateQueries({ queryKey: ['categories'] }),
      ]);
    },
  });

  const deleteMutation = useMutation<null, HTTPErrorResponse, string>({
    mutationFn: async (categoryId) => {
      const response = await api.delete(`/categories/${categoryId}`, {
        withCredentials: true,
      });
      return response.data;
    },
    onSuccess: async (_, categoryId) => {
      await Promise.all([
        queryClient.removeQueries({ queryKey: ['category', categoryId] }),
        queryClient.invalidateQueries({ queryKey: ['categories'] }),
      ]);
    },
  });

  return { createMutation, updateMutation, deleteMutation };
}
