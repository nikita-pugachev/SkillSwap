import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { UserDb, City, SkillCategory } from '@/utils/types';

interface CatalogState {
  users: UserDb[];
  skills: SkillCategory[];
  cities: City[];
  loading: boolean;
  error: string | null;
}

const initialState: CatalogState = {
  users: [],
  skills: [],
  cities: [],
  loading: true,
  error: null,
};

const catalogSlice = createSlice({
  name: 'catalog',
  initialState,
  reducers: {
    setUsers: (state, action: PayloadAction<UserDb[]>) => {
      state.users = action.payload;
    },
    setSkills: (state, action: PayloadAction<SkillCategory[]>) => {
      state.skills = action.payload;
    },
    setCities: (state, action: PayloadAction<City[]>) => {
      state.cities = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
});

export const { setUsers, setSkills, setCities, setLoading, setError } = catalogSlice.actions;
export default catalogSlice.reducer;
