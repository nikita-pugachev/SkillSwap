import type { SkillCategory, SkillType, Skill, User } from './types';

describe('types', () => {
  it('SkillCategory: тестовый объект соответствует типу', () => {
    const category: SkillCategory = 'education';
    expect(category).toBe('education');
  });

  it('SkillType: тестовый объект соответствует типу', () => {
    const type: SkillType = 'teach';
    expect(type).toBe('teach');
  });

  it('Skill: тестовый объект соответствует типу', () => {
    const skill: Skill = {
      id: 1,
      title: 'JavaScript',
      description: 'Базовый курс',
      category: 'education',
      type: 'teach',
      tags: ['frontend', 'js'],
      author: { id: 1, name: 'Иван', avatar: '/avatars/1.png' },
      imageUrl: '/skills/js.jpg',
      isFavorite: false,
    };
    expect(skill.id).toBe(1);
    expect(skill.category).toBe('education');
  });

  it('User: тестовый объект соответствует типу', () => {
    const user: User = {
      id: 1,
      name: 'Иван',
      avatar: '/avatars/1.png',
      city: 'Москва',
      birthday: '1992-03-29',
      skillsTeach: [1001],
      skillsLearn: [106, 601],
      isFavorite: false,
    };
    expect(user.id).toBe(1);
    expect(user.skillsTeach).toHaveLength(1);
  });
});
