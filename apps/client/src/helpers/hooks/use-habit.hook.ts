import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import api from '../../config/api.config';
import {
  type HabitCompletionLogDTO,
  type HabitFormDTO,
  type HabitFilterDTO,
  type HabitResponseDTO,
  type HabitUpdateDTO,
  type HTTPErrorResponse,
} from '@fokus/shared';

interface UseHabitsQueriesParams {
  selectedDate?: Date;
  habitId?: string;
  filter?: HabitFilterDTO;
}

export function useHabitQueries(query: UseHabitsQueriesParams) {
  const idQuery = useQuery<HabitResponseDTO, HTTPErrorResponse>({
    queryKey: ['habit', query.habitId, query.selectedDate],
    queryFn: async () => {
      const response = await api.get(`/habits/${query.habitId}`, {
        withCredentials: true,
        params: { selectedDate: query.selectedDate },
      });
      return response.data;
    },
    retry: 2,
    refetchOnWindowFocus: false,
    enabled: !!query.habitId && query.habitId !== 'new',
  });

  const filterQuery = useQuery<HabitResponseDTO[], HTTPErrorResponse>({
    queryKey: ['habits', query.filter, query.selectedDate],
    queryFn: async () => {
      const response = await api.get(`/habits`, {
        params: { ...query.filter, selectedDate: query.selectedDate },
        withCredentials: true,
      });
      return response.data;
    },
    retry: 2,
    refetchOnWindowFocus: false,
    enabled: !!query,
  });

  return {
    idQuery,
    filterQuery,
  };
}

export function useHabitMutations() {
  const queryClient = useQueryClient();

  const createMutation = useMutation<
    HabitResponseDTO,
    HTTPErrorResponse,
    HabitFormDTO
  >({
    mutationFn: async (data) => {
      const response = await api.post('/habits', data, {
        withCredentials: true,
      });
      return response.data;
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['habits'] });
    },
  });

  const updateMutation = useMutation<
    HabitResponseDTO,
    HTTPErrorResponse,
    {
      habitId: string;
      data: HabitUpdateDTO;
      selectedDate: Date;
    }
  >({
    mutationFn: async ({ habitId, data, selectedDate }) => {
      const response = await api.patch(`/habits/${habitId}`, data, {
        withCredentials: true,
        params: { selectedDate },
      });
      return response.data;
    },
    onSuccess: async (_, variables) => {
      const { habitId } = variables;
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['habit', habitId] }),
        queryClient.invalidateQueries({ queryKey: ['habits'] }),
      ]);
    },
  });

  const checkMutation = useMutation<
    HabitResponseDTO,
    HTTPErrorResponse,
    HabitCompletionLogDTO
  >({
    mutationFn: async ({ habitId, date }) => {
      const response = await api.post(
        `/habits/${habitId}/check`,
        {},
        { params: { date }, withCredentials: true },
      );
      return response.data;
    },
    onSuccess: async (_, variables) => {
      const { habitId } = variables;
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['habit', habitId] }),
        queryClient.invalidateQueries({ queryKey: ['habits'] }),
      ]);
    },
  });

  const uncheckMutation = useMutation<
    HabitResponseDTO,
    HTTPErrorResponse,
    HabitCompletionLogDTO
  >({
    mutationFn: async ({ habitId, date }) => {
      const response = await api.delete(`/habits/${habitId}/uncheck`, {
        params: { date },
        withCredentials: true,
      });
      return response.data;
    },
    onSuccess: async (_, variables) => {
      const { habitId } = variables;
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['habit', habitId] }),
        queryClient.invalidateQueries({ queryKey: ['habits'] }),
      ]);
    },
  });

  const deleteMutation = useMutation<null, HTTPErrorResponse, string>({
    mutationFn: async (habitId) => {
      const response = await api.delete(`/habits/${habitId}`, {
        withCredentials: true,
      });
      return response.data;
    },
    onSuccess: async (_, habitId) => {
      await Promise.all([
        queryClient.removeQueries({
          queryKey: ['habit', habitId],
          exact: false,
        }),
        queryClient.invalidateQueries({ queryKey: ['habits'] }),
      ]);
    },
  });

  return {
    createMutation,
    updateMutation,
    checkMutation,
    uncheckMutation,
    deleteMutation,
  };
}
