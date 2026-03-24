import { RootState } from '../store';
import { AuthUser } from '../slices/authSlice';

export const selectIsAuthenticated = (state: RootState): boolean => state.auth.isAuthenticated;

export const selectUser = (state: RootState): AuthUser | null => state.auth.user;

export const selectFavoriteIds = (state: RootState): number[] => state.favorites.favoriteIds;

export const selectIsFavorite =
  (userId: number) =>
  (state: RootState): boolean =>
    state.favorites.favoriteIds.includes(userId);
