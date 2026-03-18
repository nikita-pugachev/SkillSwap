import reducer, {
  initialState,
  setSearchQuery,
  setSelectedCategory,
  resetFilters,
  type SkillsState,
} from './slice';

describe('skills slice reducer', () => {
  it('setSearchQuery обновляет строку поиска', () => {
    const prevState: SkillsState = {
      ...initialState,
      searchQuery: '',
    };

    const nextState = reducer(prevState, setSearchQuery('английский'));

    expect(nextState.searchQuery).toBe('английский');
    expect(nextState.selectedCategory).toBe(prevState.selectedCategory);
    expect(nextState.items).toEqual(prevState.items);
  });

  it('setSelectedCategory обновляет категорию', () => {
    const prevState: SkillsState = {
      ...initialState,
      selectedCategory: '',
    };

    const nextState = reducer(prevState, setSelectedCategory('Иностранные языки'));

    expect(nextState.selectedCategory).toBe('Иностранные языки');
    expect(nextState.searchQuery).toBe(prevState.searchQuery);
    expect(nextState.items).toEqual(prevState.items);
  });

  it('resetFilters возвращает фильтры к начальному состоянию', () => {
    const prevState: SkillsState = {
      ...initialState,
      searchQuery: 'маркетинг',
      selectedCategory: 'Бизнес',
    };

    const nextState = reducer(prevState, resetFilters());

    expect(nextState.searchQuery).toBe(initialState.searchQuery);
    expect(nextState.selectedCategory).toBe(initialState.selectedCategory);
    expect(nextState.items).toEqual(prevState.items);
  });
});
