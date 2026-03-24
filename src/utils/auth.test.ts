import {
  getToken,
  setToken,
  removeToken,
  getStoredUser,
  setStoredUser,
  removeStoredUser,
} from './auth';

describe('auth utils', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('sets and gets token', () => {
    setToken('test-token');

    expect(getToken()).toBe('test-token');
  });

  it('removes token', () => {
    setToken('test-token');
    removeToken();

    expect(getToken()).toBeNull();
  });

  it('sets and gets user', () => {
    const user = {
      id: 1,
      name: 'Иван',
      userAvatar: 'avatar.png',
    };

    setStoredUser(user);

    expect(getStoredUser()).toEqual(user);
  });

  it('removes user', () => {
    const user = {
      id: 1,
      name: 'Иван',
      userAvatar: 'avatar.png',
    };

    setStoredUser(user);
    removeStoredUser();

    expect(getStoredUser()).toBeNull();
  });

  it('returns null if stored user is invalid JSON', () => {
    localStorage.setItem('auth_user', 'invalid-json');

    expect(getStoredUser()).toBeNull();
  });
});
