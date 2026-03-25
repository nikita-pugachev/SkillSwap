import { RootState } from '../store';
import { AuthUser } from '../slices/authSlice';
import { SkillRequest } from '../types/requests';

export const selectIsAuthenticated = (state: RootState): boolean => state.auth.isAuthenticated;

export const selectUser = (state: RootState): AuthUser | null => state.auth.user;

export const selectFavoriteIds = (state: RootState): number[] => state.favorites.favoriteIds;

export const selectIsFavorite =
  (userId: number) =>
  (state: RootState): boolean =>
    state.favorites.favoriteIds.includes(userId);

export const selectIncomingRequests =
  (userId: string) =>
  (state: RootState): SkillRequest[] =>
    state.requests.requests
      .filter((req) => req.toUserId === userId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

export const selectOutgoingRequests =
  (userId: string) =>
  (state: RootState): SkillRequest[] =>
    state.requests.requests
      .filter((req) => req.fromUserId === userId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
