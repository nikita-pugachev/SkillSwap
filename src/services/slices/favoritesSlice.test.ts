import favoritesReducer, { addFavorite, removeFavorite, toggleFavorite } from './favoritesSlice';

describe('favoritesSlice', () => {
  const initialState = { favoriteIds: [] };

  it('возвращает начальное состояние', () => {
    expect(favoritesReducer(undefined, { type: 'unknown' })).toEqual(initialState);
  });

  it('addFavorite добавляет id, если ещё нет', () => {
    const state = favoritesReducer(initialState, addFavorite(5));
    expect(state.favoriteIds).toEqual([5]);

    // повторное добавление — не дублируется
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
});
