import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import api from '../../config/api.config';
import type {
  HTTPErrorResponse,
  UserLoginDTO,
  UserRegisterDTO,
  UserResponseDTO,
  UserUpdateDTO,
} from '@fokus/shared';

export function useUserQueries() {
  const meQuery = useQuery<UserResponseDTO, HTTPErrorResponse>({
    queryKey: ['user'],
    queryFn: async () => {
      const response = await api.get<UserResponseDTO>('/users/me', {
        withCredentials: true,
      });
      return response.data;
    },
    staleTime: Infinity,
    gcTime: Infinity,
    retry: false,
  });

  return {
    meQuery,
  };
}

export function useUserMutations() {
  const queryClient = useQueryClient();

  const loginMutation = useMutation<
    UserResponseDTO,
    HTTPErrorResponse,
    UserLoginDTO
  >({
    mutationFn: async (data) => {
      const response = await api.post<UserResponseDTO>(
        '/users/auth/login',
        data,
      );

      return response.data;
    },
    onSuccess: async (newUser) => {
      queryClient.setQueryData(['user'], newUser);
    },
  });

  const registerMutation = useMutation<
    UserResponseDTO,
    HTTPErrorResponse,
    UserRegisterDTO
  >({
    mutationFn: async (data) => {
      const response = await api.post<UserResponseDTO>(
        '/users/auth/register',
        data,
      );
      return response.data;
    },
    onSuccess: async (newUser) => {
      queryClient.setQueryData(['user'], newUser);
    },
  });

  const refreshMutation = useMutation<UserResponseDTO, HTTPErrorResponse, void>(
    {
      mutationFn: async () => {
        const response = await api.post<UserResponseDTO>(
          '/users/auth/refresh/me',
          {},
          { withCredentials: true },
        );
        return response.data;
      },
      onSuccess: async () => {
        await queryClient.invalidateQueries({ queryKey: ['user'] });
      },
    },
  );

  const logoutMutation = useMutation<void, HTTPErrorResponse, void>({
    mutationFn: async () => {
      const response = await api.post(
        '/users/auth/logout/me',
        {},
        { withCredentials: true },
      );
      return response.data;
    },
    onSuccess: async () => {
      queryClient.clear();
    }
  });

  const updateMutation = useMutation<
    UserResponseDTO,
    HTTPErrorResponse,
    UserUpdateDTO
  >({
    mutationFn: async (data) => {
      const response = await api.patch('/users/me', data, {
        withCredentials: true,
      });
      return response.data;
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['user'] });
    },
  });

  const deleteMutation = useMutation<null, HTTPErrorResponse, null>({
    mutationFn: async () => {
      const response = await api.delete<null>('/users/me', {
        withCredentials: true,
      });
      return response.data;
    },
    onSuccess: async () => {
      queryClient.clear();
    },
  });

  return {
    loginMutation,
    registerMutation,
    refreshMutation,
    logoutMutation,
    updateMutation,
    deleteMutation,
  };
}
