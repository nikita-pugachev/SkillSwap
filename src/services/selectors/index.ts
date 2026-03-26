import { RootState } from '../store';
import { AuthUser } from '../slices/authSlice';
import { isStoredUserAuthenticated } from '@/utils/auth';
import { SkillRequest } from '../types/requests';
import type { UserTeachSkillEntry } from '@/utils/types';

export const selectIsAuthenticated = (state: RootState): boolean =>
  state.auth.isAuthenticated || isStoredUserAuthenticated();

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

export const selectTeachSkillsByUserId =
  (userId: number) =>
  (state: RootState): UserTeachSkillEntry[] =>
    state.profileSkills.items.filter((item) => item.userId === userId);
