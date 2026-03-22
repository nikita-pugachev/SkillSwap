import {
  AUTH_TOKEN_STORAGE_KEY,
  AUTH_USER_ID_STORAGE_KEY,
  createHeaderUser,
  getAuthenticatedUserId,
  isStoredUserAuthenticated,
} from './auth';
import type { UserDb } from './types';

describe('auth utils', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('returns null when the token is missing', () => {
    localStorage.setItem(AUTH_USER_ID_STORAGE_KEY, '7');

    expect(getAuthenticatedUserId()).toBeNull();
    expect(isStoredUserAuthenticated()).toBe(false);
  });

  it('returns the stored user id when token and userId are valid', () => {
    localStorage.setItem(AUTH_TOKEN_STORAGE_KEY, 'mock-token');
    localStorage.setItem(AUTH_USER_ID_STORAGE_KEY, '7');

    expect(getAuthenticatedUserId()).toBe(7);
    expect(isStoredUserAuthenticated()).toBe(true);
  });

  it.each([null, '0', '-1', 'NaN', 'abc'])(
    'returns null for an invalid stored userId value %p',
    (userId) => {
      localStorage.setItem(AUTH_TOKEN_STORAGE_KEY, 'mock-token');

      if (userId !== null) {
        localStorage.setItem(AUTH_USER_ID_STORAGE_KEY, userId);
      }

      expect(getAuthenticatedUserId()).toBeNull();
      expect(isStoredUserAuthenticated()).toBe(false);
    }
  );

  it('maps UserDb to HeaderUser', () => {
    const user: UserDb = {
      id: 7,
      name: 'Анна',
      userAvatar: '/anna.png',
      cityId: 1,
      gender: 'Женский',
      birthday: '1999-02-14',
      about: 'О себе',
      skillsTeach: [],
      skillsLearn: [],
      likes: 0,
      createdAt: '2026-02-01',
    };

    expect(createHeaderUser(user)).toEqual({
      name: 'Анна',
      avatar: '/anna.png',
    });
  });
});
