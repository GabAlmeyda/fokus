export type RegisterUserDTO = {
  name: string;
  email: string;
  password: string;
  themeMode: 'light' | 'dark';
};

export type UpdateUserDTO = Partial<RegisterUserDTO>;

export type LoginUserDTO = {
  email: string;
  password: string;
};

export type ResponseUserDTO = {
  id: string;
  name: string;
  email: string;
  themeMode: string;
};

export type ResponseAuthDTO = {
  user: ResponseUserDTO;
  token: string;
};

export type TokenPayload = {
  id: string;
  email: string;
};
