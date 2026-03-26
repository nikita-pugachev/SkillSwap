import favoritesReducer, { addFavorite, removeFavorite, toggleFavorite } from './favoritesSlice';
import { login, logout } from './authSlice';
import { AUTH_TOKEN_STORAGE_KEY, AUTH_USER_ID_STORAGE_KEY } from '@/utils/auth';

const FAVORITES_STORAGE_KEY_PREFIX = 'skillswap_favorites';

const getStorageKey = (userId: number) => `${FAVORITES_STORAGE_KEY_PREFIX}_${userId}`;

describe('favoritesSlice', () => {
  const initialState = { favoriteIds: [] };

  beforeEach(() => {
    localStorage.clear();
  });

  it('возвращает начальное состояние', () => {
    expect(favoritesReducer(undefined, { type: 'unknown' })).toEqual(initialState);
  });

  it('инициализирует избранное из localStorage для текущего пользователя', () => {
    localStorage.setItem(AUTH_TOKEN_STORAGE_KEY, 'mock-token');
    localStorage.setItem(AUTH_USER_ID_STORAGE_KEY, '7');
    localStorage.setItem(getStorageKey(7), JSON.stringify([3, 5]));

    expect(favoritesReducer(undefined, { type: 'unknown' })).toEqual({ favoriteIds: [3, 5] });
  });

  it('addFavorite добавляет id, если его ещё нет', () => {
    const state = favoritesReducer(initialState, addFavorite(5));
    expect(state.favoriteIds).toEqual([5]);

    const state2 = favoritesReducer(state, addFavorite(5));
    expect(state2.favoriteIds).toEqual([5]);
  });

  it('removeFavorite удаляет id, если он есть', () => {
    const stateWith = { favoriteIds: [3, 7, 12] };
    const state = favoritesReducer(stateWith, removeFavorite(7));
    expect(state.favoriteIds).toEqual([3, 12]);

    const state2 = favoritesReducer(state, removeFavorite(999));
    expect(state2.favoriteIds).toEqual([3, 12]);
  });

  it('toggleFavorite переключает состояние', () => {
    let state = favoritesReducer(initialState, toggleFavorite(42));
    expect(state.favoriteIds).toEqual([42]);

    state = favoritesReducer(state, toggleFavorite(42));
    expect(state.favoriteIds).toEqual([]);

    state = favoritesReducer(state, toggleFavorite(42));
    expect(state.favoriteIds).toEqual([42]);
  });

  it('сохраняет избранное в localStorage после изменения', () => {
    localStorage.setItem(AUTH_TOKEN_STORAGE_KEY, 'mock-token');
    localStorage.setItem(AUTH_USER_ID_STORAGE_KEY, '7');

    const state = favoritesReducer(initialState, addFavorite(5));
    expect(localStorage.getItem(getStorageKey(7))).toBe(JSON.stringify([5]));

    const nextState = favoritesReducer(state, addFavorite(9));
    expect(localStorage.getItem(getStorageKey(7))).toBe(JSON.stringify([5, 9]));

    favoritesReducer(nextState, removeFavorite(5));
    expect(localStorage.getItem(getStorageKey(7))).toBe(JSON.stringify([9]));
  });

  it('загружает избранное пользователя при login и очищает при logout', () => {
    localStorage.setItem(getStorageKey(3), JSON.stringify([11, 15]));

    let state = favoritesReducer(
      initialState,
      login({
        id: 3,
        name: 'Test User',
        userAvatar: '/avatar.png',
      })
    );

    expect(state.favoriteIds).toEqual([11, 15]);

    state = favoritesReducer(state, logout());
    expect(state.favoriteIds).toEqual([]);
  });
});
