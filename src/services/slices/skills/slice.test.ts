// skillsSelectors.test.ts
import type { RootState } from '../../store';
import {
  selectAllSkills,
  selectSearchQuery,
  selectSelectedCategory,
  selectFilteredSkills,
} from './slice';

describe('skills selectors', () => {
  const mockState: RootState = {
    skills: {
      items: [
        {
          id: 1,
          title: 'Frontend',
          icon: 'frontend-icon',
          subcategories: [
            { id: 1, title: 'React' },
            { id: 2, title: 'Vue' },
          ],
        },
        {
          id: 2,
          title: 'Backend',
          icon: 'backend-icon',
          subcategories: [
            { id: 3, title: 'Node.js' },
            { id: 4, title: 'NestJS' },
          ],
        },
        {
          id: 3,
          title: 'DevOps',
          icon: 'devops-icon',
          subcategories: [
            { id: 5, title: 'Docker' },
            { id: 6, title: 'Kubernetes' },
          ],
        },
      ],
      searchQuery: '',
      selectedCategory: '',
    },
  };

  it('selectAllSkills возвращает все skills', () => {
    expect(selectAllSkills(mockState)).toEqual(mockState.skills.items);
  });

  it('selectSearchQuery возвращает searchQuery', () => {
    const state: RootState = {
      ...mockState,
      skills: {
        ...mockState.skills,
        searchQuery: 'react',
      },
    };

    expect(selectSearchQuery(state)).toBe('react');
  });

  it('selectSelectedCategory возвращает selectedCategory', () => {
    const state: RootState = {
      ...mockState,
      skills: {
        ...mockState.skills,
        selectedCategory: 'Frontend',
      },
    };

    expect(selectSelectedCategory(state)).toBe('Frontend');
  });

  it('selectFilteredSkills возвращает все элементы, если searchQuery и selectedCategory пустые', () => {
    expect(selectFilteredSkills(mockState)).toEqual(mockState.skills.items);
  });

  it('selectFilteredSkills фильтрует по selectedCategory', () => {
    const state: RootState = {
      ...mockState,
      skills: {
        ...mockState.skills,
        selectedCategory: 'Frontend',
      },
    };

    expect(selectFilteredSkills(state)).toEqual([mockState.skills.items[0]]);
  });

  it('selectFilteredSkills фильтрует по searchQuery в title категории', () => {
    const state: RootState = {
      ...mockState,
      skills: {
        ...mockState.skills,
        searchQuery: 'back',
      },
    };

    expect(selectFilteredSkills(state)).toEqual([mockState.skills.items[1]]);
  });

  it('selectFilteredSkills фильтрует по searchQuery в subcategories', () => {
    const state: RootState = {
      ...mockState,
      skills: {
        ...mockState.skills,
        searchQuery: 'docker',
      },
    };

    expect(selectFilteredSkills(state)).toEqual([mockState.skills.items[2]]);
  });

  it('selectFilteredSkills учитывает trim и lowercase для searchQuery', () => {
    const state: RootState = {
      ...mockState,
      skills: {
        ...mockState.skills,
        searchQuery: '  ReAcT  ',
      },
    };

    expect(selectFilteredSkills(state)).toEqual([mockState.skills.items[0]]);
  });

  it('selectFilteredSkills учитывает trim и lowercase для selectedCategory', () => {
    const state: RootState = {
      ...mockState,
      skills: {
        ...mockState.skills,
        selectedCategory: '  frontend  ',
      },
    };

    expect(selectFilteredSkills(state)).toEqual([mockState.skills.items[0]]);
  });

  it('selectFilteredSkills применяет одновременно selectedCategory и searchQuery', () => {
    const state: RootState = {
      ...mockState,
      skills: {
        ...mockState.skills,
        selectedCategory: 'Frontend',
        searchQuery: 'vue',
      },
    };

    expect(selectFilteredSkills(state)).toEqual([mockState.skills.items[0]]);
  });

  it('selectFilteredSkills возвращает пустой массив, если совпадений нет', () => {
    const state: RootState = {
      ...mockState,
      skills: {
        ...mockState.skills,
        searchQuery: 'angular',
      },
    };

    expect(selectFilteredSkills(state)).toEqual([]);
  });
});
