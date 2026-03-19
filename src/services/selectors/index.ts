import { RootState } from '../store';

export const selectFavoriteIds = (state: RootState): number[] => state.favorites.favoriteIds;

export const selectIsFavorite =
  (userId: number) =>
  (state: RootState): boolean =>
    state.favorites.favoriteIds.includes(userId);
