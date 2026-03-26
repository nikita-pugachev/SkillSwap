import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type AuthUser = {
  id: number;
  name: string;
  userAvatar: string;
};

type AuthState = {
  user: AuthUser | null;
  isAuthenticated: boolean;
};

const testUser: AuthUser = {
  id: 1,
  name: 'Иван',
  userAvatar: '/src/assets/user-avatars/ivan.png',
};

const initialState: AuthState = {
  user: testUser,
  isAuthenticated: true,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login: (state, action: PayloadAction<AuthUser>) => {
      state.user = action.payload;
      state.isAuthenticated = true;
    },
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
    },
  },
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;
