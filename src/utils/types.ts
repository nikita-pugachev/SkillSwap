export type SkillCategorySlug =
  | 'education'
  | 'business'
  | 'art'
  | 'languages'
  | 'home'
  | 'health'
  | 'other';

export type SkillType = 'teach' | 'learn';

export interface UserSkill {
  name: string;
  category?: SkillCategorySlug;
}

export interface SkillAuthor {
  id: number;
  name: string;
  avatar: string;
}

export interface Skill {
  id: number;
  title: string;
  description: string;
  category: SkillCategorySlug;
  type: SkillType;
  tags: string[];
  author: SkillAuthor;
  imageUrl: string;
  isFavorite: boolean;
}

export interface User {
  id: number;
  name: string;
  avatar: string;
  city: string;
  birthday: string;
  skillsTeach: UserSkill[];
  skillsLearn: UserSkill[];
  isFavorite: boolean;
}

export interface Subcategory {
  id: number;
  title: string;
}

export interface SkillCategory {
  id: number;
  title: string;
  icon: string;
  subcategories: Subcategory[];
}

export interface City {
  id: number;
  name: string;
}

export interface Filters {
  mode: 'all' | 'wantToLearn' | 'canTeach';
  skills: number[];
  gender: 'Мужской' | 'Женский' | null;
  city: string[];
}

export interface UserSkillTeach {
  id: number;
  customTitle: string;
  subcategoryId: number;
  description: string;
  images: string[];
}

export interface UserFromDb {
  id: number;
  name: string;
  userAvatar: string;
  cityId: number;
  gender: string;
  birthday: string;
  about: string;
  skillsTeach: UserSkillTeach[];
  skillsLearn: number[];
  likes: number;
  createdAt: string;
}

export type TSelectOption = {
  id: number;
  name: string;
};

export type NullableDate = Date | null;

export type CalendarCell = {
  date: Date;
  currentMonth: boolean;
};

export type DateValidationOptions = {
  minDate: Date;
  maxDate: Date;
};

export type TCategoryWithSubcategories = {
  id: number;
  title: string;
  icon: string;
  subcategories: {
    id: number;
    title: string;
  }[];
};

export type TSubcategoryOption = {
  id: number;
  title: string;
  categoryId: number;
  categoryTitle: string;
};
