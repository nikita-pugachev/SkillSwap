import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { UserTeachSkillEntry } from '@/utils/types';

type ProfileSkillsState = {
  items: UserTeachSkillEntry[];
  loaded: boolean;
};

const initialState: ProfileSkillsState = {
  items: [],
  loaded: false,
};

const profileSkillsSlice = createSlice({
  name: 'profileSkills',
  initialState,
  reducers: {
    replaceTeachSkills: (state, action: PayloadAction<UserTeachSkillEntry[]>) => {
      state.items = action.payload;
      state.loaded = true;
    },
    removeTeachSkill: (state, action: PayloadAction<{ userId: number; teachSkillId: number }>) => {
      const { userId, teachSkillId } = action.payload;
      state.items = state.items.filter(
        (item) => !(item.userId === userId && item.teachSkillId === teachSkillId)
      );
    },
  },
});

export const { replaceTeachSkills, removeTeachSkill } = profileSkillsSlice.actions;
export default profileSkillsSlice.reducer;
