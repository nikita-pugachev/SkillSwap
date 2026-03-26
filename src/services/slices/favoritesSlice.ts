import { createSlice, PayloadAction, UnknownAction } from '@reduxjs/toolkit';
import { login, logout } from './authSlice';
import { getAuthenticatedUserId } from '@/utils/auth';

interface FavoritesState {
  favoriteIds: number[];
}

const FAVORITES_STORAGE_KEY_PREFIX = 'skillswap_favorites';

const initialState: FavoritesState = {
  favoriteIds: [],
};

const getFavoritesStorageKey = (userId: number) => `${FAVORITES_STORAGE_KEY_PREFIX}_${userId}`;

const normalizeFavoriteIds = (value: unknown): number[] => {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.filter((id): id is number => typeof id === 'number');
};

const loadFavoritesFromStorage = (userId = getAuthenticatedUserId()): number[] => {
  if (!userId) {
    return [];
  }

  try {
    const savedFavorites = localStorage.getItem(getFavoritesStorageKey(userId));

    if (!savedFavorites) {
      return [];
    }

    return normalizeFavoriteIds(JSON.parse(savedFavorites));
  } catch (error) {
    console.error('Failed to load favorites from localStorage', error);
    return [];
  }
};

const saveFavoritesToStorage = (favoriteIds: number[], userId = getAuthenticatedUserId()) => {
  if (!userId) {
    return;
  }

  try {
    localStorage.setItem(getFavoritesStorageKey(userId), JSON.stringify(favoriteIds));
  } catch (error) {
    console.error('Failed to save favorites to localStorage', error);
  }
};

const favoritesSlice = createSlice({
  name: 'favorites',
  initialState,
  reducers: {
    addFavorite: (state, action: PayloadAction<number>) => {
      const id = action.payload;

      if (!state.favoriteIds.includes(id)) {
        state.favoriteIds.push(id);
        saveFavoritesToStorage(state.favoriteIds);
      }
    },

    removeFavorite: (state, action: PayloadAction<number>) => {
      const id = action.payload;
      state.favoriteIds = state.favoriteIds.filter((favId) => favId !== id);
      saveFavoritesToStorage(state.favoriteIds);
    },

    toggleFavorite: (state, action: PayloadAction<number>) => {
      const id = action.payload;

      if (state.favoriteIds.includes(id)) {
        state.favoriteIds = state.favoriteIds.filter((favId) => favId !== id);
      } else {
        state.favoriteIds.push(id);
      }

      saveFavoritesToStorage(state.favoriteIds);
    },
  },
  extraReducers: (builder) => {
    builder.addCase(login, (state, action) => {
      state.favoriteIds = loadFavoritesFromStorage(action.payload.id);
    });

    builder.addCase(logout, (state) => {
      state.favoriteIds = [];
    });
  },
});

const reducer = (state: FavoritesState | undefined, action: UnknownAction) => {
  if (state === undefined) {
    return favoritesSlice.reducer({ favoriteIds: loadFavoritesFromStorage() }, action);
  }

  return favoritesSlice.reducer(state, action);
};

export const { addFavorite, removeFavorite, toggleFavorite } = favoritesSlice.actions;

export default reducer;
