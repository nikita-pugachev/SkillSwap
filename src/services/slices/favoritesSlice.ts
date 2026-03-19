import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface FavoritesState {
  favoriteIds: number[];
}

const initialState: FavoritesState = {
  favoriteIds: [],
};

const favoritesSlice = createSlice({
  name: 'favorites',
  initialState,
  reducers: {
    addFavorite: (state, action: PayloadAction<number>) => {
      const id = action.payload;
      if (!state.favoriteIds.includes(id)) {
        state.favoriteIds.push(id);
      }
    },

    removeFavorite: (state, action: PayloadAction<number>) => {
      const id = action.payload;
      state.favoriteIds = state.favoriteIds.filter((favId) => favId !== id);
    },

    toggleFavorite: (state, action: PayloadAction<number>) => {
      const id = action.payload;
      if (state.favoriteIds.includes(id)) {
        state.favoriteIds = state.favoriteIds.filter((favId) => favId !== id);
      } else {
        state.favoriteIds.push(id);
      }
    },
  },
});

export const { addFavorite, removeFavorite, toggleFavorite } = favoritesSlice.actions;

export default favoritesSlice.reducer;
