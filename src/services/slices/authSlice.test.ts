import authReducer, { login, logout, AuthUser } from './authSlice';

describe('authSlice', () => {
  const testUser: AuthUser = {
    id: 1,
    name: 'Иван',
    userAvatar: '/src/assets/user-avatars/ivan.png',
  };

  it('возврат начального состояния', () => {
    expect(authReducer(undefined, { type: 'unknown' })).toEqual({
      user: null,
      isAuthenticated: false,
    });
  });

  it('обработка action login', () => {
    const nextState = authReducer({ user: null, isAuthenticated: false }, login(testUser));

    expect(nextState).toEqual({
      user: testUser,
      isAuthenticated: true,
    });
  });

  it('обработка action logout', () => {
    const initialStateWithUser = {
      user: testUser,
      isAuthenticated: true,
    };

    const nextState = authReducer(initialStateWithUser, logout());

    expect(nextState).toEqual({
      user: null,
      isAuthenticated: false,
    });
  });
});
