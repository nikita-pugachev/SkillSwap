import type { SkillCategorySlug, SkillType, Skill, UserCardModel } from './types';

describe('types', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });

  it('SkillCategorySlug: тестовый объект соответствует типу', () => {
    const category: SkillCategorySlug = 'education';
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
    const user: UserCardModel = {
      id: 1,
      name: 'Иван',
      avatar: '/avatars/1.png',
      city: 'Москва',
      birthday: '1992-03-29',
      skillsTeach: [{ name: 'JavaScript', category: 'education' }],
      skillsLearn: [
        { name: 'English', category: 'languages' },
        { name: 'Negotiation', category: 'business' },
      ],
      isFavorite: false,
      likes: 0,
    };
    expect(user.id).toBe(1);
    expect(user.skillsTeach).toHaveLength(1);
  });
});
