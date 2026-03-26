import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { getStoredUser, getToken, removeStoredUser, setStoredUser } from '@/utils/auth';

export type AuthUserGender = 'Мужской' | 'Женский' | 'Не указан';

export type AuthUser = {
  id: number;
  name: string;
  userAvatar: string;
  email?: string;
  password?: string;
  city?: string;
  cityId?: number;
  gender?: AuthUserGender;
  birthday?: string;
  about?: string;
};

type AuthState = {
  user: AuthUser | null;
  isAuthenticated: boolean;
};

const savedUser = getStoredUser();
const initialState: AuthState = {
  user: savedUser,
  isAuthenticated: Boolean(savedUser && getToken()),
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login: (state, action: PayloadAction<AuthUser>) => {
      state.user = action.payload;
      state.isAuthenticated = true;
      setStoredUser(state.user);
    },
    userEdit: (state, action: PayloadAction<Partial<AuthUser>>) => {
      if (!state.user) {
        return;
      }

      state.user = { ...state.user, ...action.payload };
      setStoredUser(state.user);
    },
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      removeStoredUser();
    },
  },
});

export const { login, userEdit, logout } = authSlice.actions;
export default authSlice.reducer;
