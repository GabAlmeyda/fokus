export type RegisterUserDTO = {
  name: string;
  email: string;
  password: string;
  themeMode: 'light' | 'dark';
};

export type ResponseUserDTO = {
  id: string;
  name: string;
  email: string;
  themeMode: string;
};
