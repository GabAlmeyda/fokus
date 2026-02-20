import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import api from '../../config/api.config';
import {
  type HabitCompletionLogDTO,
  type HabitCreateDTO,
  type HabitFilterDTO,
  type HabitResponseDTO,
  type HabitUpdateDTO,
  type HTTPErrorResponse,
} from '@fokus/shared';

interface UseHabitsQueriesParams {
  habitId?: string;
  filter?: HabitFilterDTO;
}

export function useHabitsQueries({ habitId, filter }: UseHabitsQueriesParams) {
  const habitQuery = useQuery({
    queryKey: ['habit', habitId],
    queryFn: async () => {
      const response = await api.get(`/habits/${habitId}`, {
        withCredentials: true,
      });
      return response.data;
    },
    enabled: !!habitId,
  });

  const habitsFilterQuery = useQuery({
    queryKey: ['habits', filter],
    queryFn: async () => {
      const response = await api.get(`/habits`, {
        params: filter,
        withCredentials: true,
      });
      return response.data;
    },
    enabled: !!filter,
  });

  return {
    habitQuery,
    habitsFilterQuery,
  };
}

export function useHabitsMutations() {
  const queryClient = useQueryClient();

  const createMutation = useMutation<
    HabitResponseDTO,
    HTTPErrorResponse,
    HabitCreateDTO
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
    }
  >({
    mutationFn: async ({ habitId, data }) => {
      const response = await api.patch(`/habits/${habitId}`, data, {
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
      queryClient.removeQueries({ queryKey: ['habit', habitId] });
      await queryClient.invalidateQueries({ queryKey: ['habits'] });
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
