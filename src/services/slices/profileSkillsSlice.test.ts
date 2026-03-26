import profileSkillsReducer, { removeTeachSkill, replaceTeachSkills } from './profileSkillsSlice';
import type { UserTeachSkillEntry } from '@/utils/types';

const sample: UserTeachSkillEntry[] = [
  {
    userId: 1,
    teachSkillId: 1001,
    title: 'Барабаны',
    subcategoryId: 404,
    categoryTitle: 'Творчество и искусство',
    subcategoryTitle: 'Музыка и звук',
  },
  {
    userId: 2,
    teachSkillId: 1002,
    title: 'Английский',
    subcategoryId: 201,
    categoryTitle: 'Иностранные языки',
    subcategoryTitle: 'Английский',
  },
];

describe('profileSkillsSlice', () => {
  it('replaceTeachSkills заполняет список и выставляет loaded', () => {
    const next = profileSkillsReducer(undefined, replaceTeachSkills(sample));
    expect(next.items).toEqual(sample);
    expect(next.loaded).toBe(true);
  });

  it('removeTeachSkill удаляет запись по userId и teachSkillId', () => {
    const state = profileSkillsReducer(undefined, replaceTeachSkills(sample));
    const next = profileSkillsReducer(state, removeTeachSkill({ userId: 1, teachSkillId: 1001 }));
    expect(next.items).toEqual([sample[1]]);
  });
});
