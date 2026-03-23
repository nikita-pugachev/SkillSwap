import type { TCategoryWithSubcategories, TSubcategoryOption } from '@/utils/types';

export const mapCategoriesToSubcategoryOptions = (
  categories: TCategoryWithSubcategories[]
): TSubcategoryOption[] => {
  return categories.flatMap((category) =>
    category.subcategories.map((subcategory) => ({
      id: subcategory.id,
      title: subcategory.title,
      categoryId: category.id,
      categoryTitle: category.title,
    }))
  );
};
