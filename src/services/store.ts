import { configureStore } from '@reduxjs/toolkit';
import favoritesReducer from './slices/favoritesSlice';
import catalogReducer from './slices/catalogSlice';
import authReducer from './slices/authSlice';
import skillsReducer from './slices/skillsSlice';
import requestsReducer from './slices/requestsSlice';
export const store = configureStore({
  reducer: {
    favorites: favoritesReducer,
    catalog: catalogReducer,
    auth: authReducer,
    skills: skillsReducer,
    requests: requestsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
