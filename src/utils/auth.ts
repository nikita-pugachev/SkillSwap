import type { AuthUser } from '@/services/slices/authSlice';
import type { UserDb } from './types';

export const AUTH_TOKEN_STORAGE_KEY = 'token';
export const AUTH_USER_ID_STORAGE_KEY = 'userId';
export const AUTH_USER_STORAGE_KEY = 'auth_user';

export type HeaderUser = {
  name: string;
  avatar: string;
};

export const getToken = (): string | null => localStorage.getItem(AUTH_TOKEN_STORAGE_KEY);

export const setToken = (token: string): void => {
  localStorage.setItem(AUTH_TOKEN_STORAGE_KEY, token);
};

export const removeToken = (): void => {
  localStorage.removeItem(AUTH_TOKEN_STORAGE_KEY);
};

const parseStoredUser = (rawUser: string | null): AuthUser | null => {
  if (!rawUser) {
    return null;
  }

  try {
    return JSON.parse(rawUser) as AuthUser;
  } catch {
    return null;
  }
};

export const getStoredUser = (): AuthUser | null => {
  return parseStoredUser(localStorage.getItem(AUTH_USER_STORAGE_KEY));
};

export const setStoredUser = (user: AuthUser): void => {
  localStorage.setItem(AUTH_USER_STORAGE_KEY, JSON.stringify(user));
  localStorage.setItem(AUTH_USER_ID_STORAGE_KEY, String(user.id));
};

export const removeStoredUser = (): void => {
  localStorage.removeItem(AUTH_USER_STORAGE_KEY);
  localStorage.removeItem(AUTH_USER_ID_STORAGE_KEY);
};

const hasStoredAuthToken = () => {
  return Boolean(getToken());
};

const getStoredUserId = () => {
  const storedUser = getStoredUser();

  if (storedUser && Number.isInteger(storedUser.id) && storedUser.id > 0) {
    return storedUser.id;
  }

  const storedUserId = Number(localStorage.getItem(AUTH_USER_ID_STORAGE_KEY));

  return Number.isInteger(storedUserId) && storedUserId > 0 ? storedUserId : null;
};

export const getAuthenticatedUserId = () => {
  if (!hasStoredAuthToken()) {
    return null;
  }

  return getStoredUserId();
};

export const isStoredUserAuthenticated = () => {
  return getAuthenticatedUserId() !== null;
};

export const createHeaderUser = (user: UserDb): HeaderUser => ({
  name: user.name,
  avatar: user.userAvatar,
});
