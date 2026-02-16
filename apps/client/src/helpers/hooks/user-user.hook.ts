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
  const meQuery = useQuery<UserResponseDTO, HTTPErrorResponse, any>({
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

  const loginMutation = useMutation<UserResponseDTO, HTTPErrorResponse, any>({
    mutationFn: async (data: UserLoginDTO) => {
      const response = await api.post<UserResponseDTO>(
        '/users/auth/login',
        data,
      );

      return response.data;
    },
    onSuccess: async (newUser) => {
      queryClient.setQueryData(['user'], newUser);
      await queryClient.invalidateQueries({ queryKey: ['user'] });
    },
  });

  const registerMutation = useMutation<UserResponseDTO, HTTPErrorResponse, any>(
    {
      mutationFn: async (data: UserRegisterDTO) => {
        const response = await api.post<UserResponseDTO>(
          '/users/auth/register',
          data,
        );
        return response.data;
      },
      onSuccess: async (newUser) => {
        queryClient.setQueryData(['user'], newUser);
        await queryClient.invalidateQueries({ queryKey: ['user'] });
      },
    },
  );

  const refreshMutation = useMutation<UserResponseDTO, HTTPErrorResponse, any>({
    mutationFn: async () => {
      const response = await api.post<UserResponseDTO>(
        '/users/auth/refresh/me',
        {},
        { withCredentials: true },
      );
      return response.data;
    },
    onSuccess: async (newUser) => {
      queryClient.setQueryData(['user'], newUser);
      await queryClient.invalidateQueries({ queryKey: ['user'] });
    },
  });

  const updateMutation = useMutation<UserResponseDTO, HTTPErrorResponse, any>({
    mutationFn: async (data: UserUpdateDTO) => {
      const response = await api.patch('/users/me', data, {
        withCredentials: true,
      });
      return response.data;
    },
    onSuccess: async (newUser) => {
      queryClient.setQueryData(['user'], newUser);
      await queryClient.invalidateQueries({ queryKey: ['user'] });
    },
  });

  const deleteMutation = useMutation<null, HTTPErrorResponse, any>({
    mutationFn: async () => {
      const response = await api.delete<null>('/users/me', {
        withCredentials: true,
      });
      return response.data;
    },
    onSuccess: async () => {
      queryClient.removeQueries({ queryKey: ['user'] });
    },
  });

  return {
    loginMutation,
    registerMutation,
    refreshMutation,
    updateMutation,
    deleteMutation,
  };
}
