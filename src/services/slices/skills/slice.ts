import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { Skill } from '@/utils/types';
export interface SkillsState {
  items: Skill[];
  searchQuery: string;
  selectedCategory: string;
}
export const initialState: SkillsState = { items: [], searchQuery: '', selectedCategory: '' };
export const skillsSlice = createSlice({
  name: 'skills',
  initialState,
  reducers: {
    setSkills(state, action: PayloadAction<Skill[]>) {
      state.items = action.payload;
    },
    setSearchQuery(state, action: PayloadAction<string>) {
      state.searchQuery = action.payload;
    },
    setSelectedCategory(state, action: PayloadAction<string>) {
      state.selectedCategory = action.payload;
    },
    resetFilters(state) {
      state.searchQuery = '';
      state.selectedCategory = '';
    },
  },
});

export const { setSkills, setSearchQuery, setSelectedCategory, resetFilters } = skillsSlice.actions;
export default skillsSlice.reducer;
