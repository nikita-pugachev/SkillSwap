import type { UserDb } from './types';

export const AUTH_TOKEN_STORAGE_KEY = 'token';
export const AUTH_USER_ID_STORAGE_KEY = 'userId';
export const FALLBACK_AUTH_USER_ID = 1;

export type HeaderUser = {
  name: string;
  avatar: string;
};

export const isStoredUserAuthenticated = () => {
  return Boolean(localStorage.getItem(AUTH_TOKEN_STORAGE_KEY));
};

export const getAuthenticatedUserId = () => {
  if (!isStoredUserAuthenticated()) {
    return null;
  }

  const storedUserId = Number(localStorage.getItem(AUTH_USER_ID_STORAGE_KEY));

  return Number.isInteger(storedUserId) && storedUserId > 0 ? storedUserId : FALLBACK_AUTH_USER_ID;
};

export const createHeaderUser = (user: UserDb): HeaderUser => ({
  name: user.name,
  avatar: user.userAvatar,
});
