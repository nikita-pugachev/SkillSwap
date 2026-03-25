import { RootState } from '../store';
import { AuthUser } from '../slices/authSlice';
import { isStoredUserAuthenticated } from '@/utils/auth';

export const selectIsAuthenticated = (state: RootState): boolean =>
  state.auth.isAuthenticated || isStoredUserAuthenticated();

export const selectUser = (state: RootState): AuthUser | null => state.auth.user;

export const selectFavoriteIds = (state: RootState): number[] => state.favorites.favoriteIds;

export const selectIsFavorite =
  (userId: number) =>
  (state: RootState): boolean =>
    state.favorites.favoriteIds.includes(userId);
