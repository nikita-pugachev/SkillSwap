import type { RootState } from '../store';

export const selectAllSkills = (state: RootState) => state.skills.items;
export const selectSearchQuery = (state: RootState) => state.skills.searchQuery;
export const selectSelectedCategory = (state: RootState) => state.skills.selectedCategory;
export const selectFilteredSkills = (state: RootState) => {
  const items = state.skills.items;
  const searchQuery = state.skills.searchQuery.trim().toLowerCase();
  const selectedCategory = state.skills.selectedCategory.trim().toLowerCase();

  return items.filter((category) => {
    const matchesCategory =
      selectedCategory === '' || selectedCategory === category.title.toLowerCase();

    const matchesSearch =
      searchQuery === '' ||
      category.title.toLowerCase().includes(searchQuery) ||
      category.subcategories.some((sub) => sub.title.toLowerCase().includes(searchQuery));

    return matchesCategory && matchesSearch;
  });
};
