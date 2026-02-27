import type {
  EntityIdDTO,
  GoalCreateDTO,
  GoalFilterDTO,
  GoalProgressLogDTO,
  GoalResponseDTO,
  GoalUpdateDTO,
  HTTPErrorResponse,
} from '@fokus/shared';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import api from '../../config/api.config';

interface UseGoalQueriesParams {
  goalId?: string;
  filter?: GoalFilterDTO;
}

export function useGoalQueries({ goalId, filter }: UseGoalQueriesParams) {
  const idQuery = useQuery<GoalResponseDTO, HTTPErrorResponse>({
    queryKey: ['goal', goalId],
    queryFn: async () => {
      const response = await api.get(`/goals/${goalId}`, {
        withCredentials: true,
      });
      return response.data;
    },
    enabled: !!goalId,
  });

  const filterQuery = useQuery<GoalResponseDTO[], HTTPErrorResponse>({
    queryKey: ['goals', filter],
    queryFn: async () => {
      const response = await api.get('/goals', {
        withCredentials: true,
        params: filter,
      });
      return response.data;
    },
    enabled: !!filter,
  });

  return { idQuery, filterQuery };
}

export function useGoalMutations() {
  const queryClient = useQueryClient();

  const createMutation = useMutation<
    GoalResponseDTO,
    HTTPErrorResponse,
    GoalCreateDTO
  >({
    mutationFn: async (data) => {
      const response = await api.post('/goals', data, {
        withCredentials: true,
      });
      return response.data;
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['goals'] });
    },
  });

  const addLogMutation = useMutation<
    { updatedGoal: GoalResponseDTO; progressLogId: EntityIdDTO },
    HTTPErrorResponse,
    Omit<GoalProgressLogDTO, 'userId'>
  >({
    mutationFn: async (data) => {
      const { date, value } = data;
      const response = await api.post(
        `/goals/${data.goalId}/logs`,
        { date, value },
        { withCredentials: true },
      );
      return response.data;
    },
    onSuccess: async (_, variables) => {
      const { goalId } = variables;
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['goal', goalId] }),
        queryClient.invalidateQueries({ queryKey: ['goals'] }),
      ]);
    },
  });

  const updateMutation = useMutation<
    GoalResponseDTO,
    HTTPErrorResponse,
    { goalId: string; newData: GoalUpdateDTO }
  >({
    mutationFn: async ({ goalId, newData }) => {
      const response = await api.patch(`/goals/${goalId}`, newData, {
        withCredentials: true,
      });
      return response.data;
    },
    onSuccess: async (_, variables) => {
      const { goalId } = variables;
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['goal', goalId] }),
        queryClient.invalidateQueries({ queryKey: ['goals'] }),
      ]);
    },
  });

  const removeLogMutation = useMutation<
    GoalResponseDTO,
    HTTPErrorResponse,
    { progressLogId: EntityIdDTO; goalId: EntityIdDTO }
  >({
    mutationFn: async ({ progressLogId, goalId }) => {
      const response = await api.delete(
        `/goals/${goalId}/logs/${progressLogId}`,
        {
          withCredentials: true,
        },
      );
      return response.data;
    },
    onSuccess: async (_, variables) => {
      const { goalId } = variables;
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['goal', goalId] }),
        queryClient.invalidateQueries({ queryKey: ['goals'] }),
      ]);
    },
  });

  const deleteMutation = useMutation<null, HTTPErrorResponse, EntityIdDTO>({
    mutationFn: async (goalId) => {
      const response = await api.delete(`/goals/${goalId}`, {
        withCredentials: true,
      });
      return response.data;
    },
    onSuccess: async (goalId) => {
      Promise.all([
        queryClient.removeQueries({ queryKey: ['goal', goalId] }),
        queryClient.invalidateQueries({ queryKey: ['goals'] }),
      ]);
    },
  });

  return {
    createMutation,
    addLogMutation,
    updateMutation,
    deleteMutation,
    removeLogMutation,
  };
}
