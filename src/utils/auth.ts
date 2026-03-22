import type { UserDb } from './types';

export const AUTH_TOKEN_STORAGE_KEY = 'token';
export const AUTH_USER_ID_STORAGE_KEY = 'userId';

export type HeaderUser = {
  name: string;
  avatar: string;
};

const hasStoredAuthToken = () => {
  return Boolean(localStorage.getItem(AUTH_TOKEN_STORAGE_KEY));
};

export const getAuthenticatedUserId = () => {
  if (!hasStoredAuthToken()) {
    return null;
  }

  const storedUserId = Number(localStorage.getItem(AUTH_USER_ID_STORAGE_KEY));

  return Number.isInteger(storedUserId) && storedUserId > 0 ? storedUserId : null;
};

export const isStoredUserAuthenticated = () => {
  return getAuthenticatedUserId() !== null;
};

export const createHeaderUser = (user: UserDb): HeaderUser => ({
  name: user.name,
  avatar: user.userAvatar,
});
