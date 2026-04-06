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
  const meQuery = useQuery<UserResponseDTO['user'], HTTPErrorResponse>({
    queryKey: ['user'],
    queryFn: async () => {
      const response = await api.get<UserResponseDTO>('/users/me', {
        withCredentials: true,
      });
      return response.data.user;
    },
    refetchOnWindowFocus: false,
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
      sessionStorage.setItem('xsrf-token', newUser.xsrfToken);
      queryClient.setQueryData(['user'], newUser.user);
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
      sessionStorage.setItem('xsrf-token', newUser.xsrfToken);
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
      onSuccess: async (newUser) => {
        sessionStorage.setItem('xsrf-token', newUser.xsrfToken);
        queryClient.setQueryData(['user'], newUser.user);
      },
    },
  );

  const logoutMutation = useMutation<null, HTTPErrorResponse, void>({
    mutationFn: async () => {
      const response = await api.post<null>(
        '/users/auth/logout/me',
        {},
        { withCredentials: true },
      );
      return response.data;
    },
    onSuccess: async () => {
      queryClient.clear();
      sessionStorage.clear();
    },
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
    onMutate: async (newData) => {
      if (!newData.themeMode) return;

      await queryClient.cancelQueries({ queryKey: ['user'] });
      const previousUser = queryClient.getQueryData(['user']);
      queryClient.setQueryData(
        ['user'],
        (old: Omit<UserResponseDTO, 'userId'>) => ({
          ...old,
          themeMode: newData.themeMode,
        }),
      );

      return { previousUser };
    },
    onError: (_err, _variables, context) => {
      const { previousUser } = context as {
        previousUser: Omit<UserResponseDTO, 'userId'>;
      };
      queryClient.setQueryData(['user'], previousUser);
    },
    onSettled: async () => {
      await queryClient.invalidateQueries({ queryKey: ['user'] });
    },
    retry: 0,
  });

  const deleteMutation = useMutation<null, HTTPErrorResponse, void>({
    mutationFn: async () => {
      const response = await api.delete<null>('/users/me', {
        withCredentials: true,
      });
      return response.data;
    },
    onSuccess: async () => {
      queryClient.clear();
      sessionStorage.clear();
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
