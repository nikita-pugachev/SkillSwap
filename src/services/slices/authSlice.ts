import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type AuthUser = {
  id: number;
  name: string;
  userAvatar: string;
  email: string;
  password: string;
  city: string;
  gender?: 'Мужской' | 'Женский';
  birthday?: string;
  about?: string;
};

type AuthState = {
  user: AuthUser | null;
  isAuthenticated: boolean;
};

const savedUser = localStorage.getItem('user');
const initialState: AuthState = {
  user: savedUser ? JSON.parse(savedUser) : null,
  isAuthenticated: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login: (state, action: PayloadAction<AuthUser>) => {
      state.user = action.payload;
      state.isAuthenticated = true;
      localStorage.setItem('user', JSON.stringify(state.user));
    },
    userEdit: (state, action: PayloadAction<Partial<AuthUser>>) => {
      if (!state.user) {
        return;
      }
      state.user = { ...state.user, ...action.payload };
      localStorage.setItem('user', JSON.stringify(state.user));
    },
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      localStorage.removeItem('user');
    },
  },
});

export const { login, userEdit, logout } = authSlice.actions;
export default authSlice.reducer;
