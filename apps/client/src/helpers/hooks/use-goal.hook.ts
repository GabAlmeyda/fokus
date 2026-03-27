import type {
  EntityIdDTO,
  GoalFilterDTO,
  GoalFormDTO,
  GoalProgressLogDTO,
  GoalResponseDTO,
  GoalUpdateDTO,
  HTTPErrorResponse,
  ProgressLogResponseDTO,
} from '@fokus/shared';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import api from '../../config/api.config';

interface UseGoalQueriesParams {
  goalId?: string;
  filter?: GoalFilterDTO;
}

export function useGoalQueries(query: UseGoalQueriesParams) {
  const idQuery = useQuery<GoalResponseDTO, HTTPErrorResponse>({
    queryKey: ['goal', query.goalId],
    queryFn: async () => {
      const response = await api.get(`/goals/${query.goalId}`, {
        withCredentials: true,
      });

      const data = response.data;
      if (data.deadline) {
        data.deadline = new Date(data.deadline);
      }

      return data;
    },
    retry: 2,
    refetchOnWindowFocus: false,
    enabled: !!query.goalId && query.goalId !== 'new',
  });

  const filterQuery = useQuery<GoalResponseDTO[], HTTPErrorResponse>({
    queryKey: ['goals', query.filter],
    queryFn: async () => {
      const response = await api.get('/goals', {
        withCredentials: true,
        params: query.filter,
      });
      return response.data;
    },
    retry: 2,
    refetchOnWindowFocus: false,
    enabled: !!query,
  });

  const logsQuery = useQuery<ProgressLogResponseDTO[], HTTPErrorResponse>({
    queryKey: ['goal-logs', query.goalId],
    queryFn: async () => {
      const response = await api.get(`/goals/${query.goalId}/logs`, {
        withCredentials: true,
      });
      return response.data;
    },
    retry: 2,
    refetchOnWindowFocus: false,
    enabled: !!query.goalId && query.goalId !== 'new',
  });

  return { idQuery, filterQuery, logsQuery };
}

export function useGoalMutations() {
  const queryClient = useQueryClient();

  const createMutation = useMutation<
    GoalResponseDTO,
    HTTPErrorResponse,
    GoalFormDTO
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
    onSuccess: async (_, { goalId }) => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['goal', goalId] }),
        queryClient.invalidateQueries({ queryKey: ['goal-logs', goalId] }),
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
    onSuccess: async (_, { goalId }) => {
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
    onSuccess: async (_, { goalId }) => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['goal', goalId] }),
        queryClient.invalidateQueries({ queryKey: ['goal-logs', goalId] }),
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
      await Promise.all([
        queryClient.removeQueries({ queryKey: ['goal', goalId] }),
        queryClient.removeQueries({ queryKey: ['goal-logs', goalId] }),
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
