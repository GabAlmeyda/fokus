import type { InvalidField } from '../types/http-types.js';
import type { RegisterUserDTO, ResponseAuthDTO } from '../types/user-types.js';
import emailValidator from 'email-validator';

export const USER_THEME_MODES = ['light', 'dark'] as const;
export type UserThemesType = (typeof USER_THEME_MODES)[number];

export function validateRegisterUserDTO(
  user: unknown,
): user is RegisterUserDTO {
  if (typeof user !== 'object' || user === null) {
    return false;
  }

  const u = user as Record<string, unknown>;

  if (
    typeof u.name !== 'string' ||
    typeof u.email !== 'string' ||
    typeof u.password !== 'string' ||
    typeof u.themeMode !== 'string'
  ) {
    return false;
  }

  if (!USER_THEME_MODES.includes(u.themeMode as UserThemesType)) {
    return false;
  }

  return true;
}

export function validateResponseAuthDTO(
  auth: unknown,
): auth is ResponseAuthDTO {
  if (typeof auth !== 'object' || auth === null) {
    return false;
  }

  const a = auth as Record<string, unknown>;

  if (typeof a.token !== 'string') {
    return false;
  }

  if (typeof a.user !== 'object' || a.user === null) {
    return false;
  }

  const u = a.user as Record<string, unknown>;

  if (
    typeof u.id !== 'string' ||
    typeof u.name !== 'string' ||
    typeof u.email !== 'string' ||
    typeof u.themeMode !== 'string'
  ) {
    return false;
  }

  if (!USER_THEME_MODES.includes(u.themeMode as UserThemesType)) {
    return false;
  }

  return true;
}

export function validateRegisterUserData(
  user: RegisterUserDTO,
): InvalidField[] {
  const invalidFields: InvalidField[] = [];

  if (!user.name || user.name.length < 2) {
    invalidFields.push({
      field: 'name',
      message: 'field too short. Minimum of 2 characters.',
    });
  }

  if (!user.email || !emailValidator.validate(user.email)) {
    invalidFields.push({
      field: 'email',
      message: 'Invalid email provided.',
    });
  }

  if (!user.password || user.password.length < 8) {
    invalidFields.push({
      field: 'password',
      message: 'password too short. Minimum of 8 characters.',
    });
  }

  if (!user.themeMode || !USER_THEME_MODES.includes(user.themeMode)) {
    invalidFields.push({
      field: 'themeMode',
      message: 'Invalid theme mode provided.',
    });
  }

  return invalidFields;
}
