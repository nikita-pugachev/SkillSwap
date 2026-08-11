export type SkillCategorySlug =
  | 'education'
  | 'business'
  | 'art'
  | 'languages'
  | 'home'
  | 'health'
  | 'other';

export interface SkillSubcategory {
  id: number;
  title: string;
}

export interface SkillCategory {
  id: number;
  title: string;
  icon: string;
  slug: SkillCategorySlug;
  subcategories: SkillSubcategory[];
}

export type SkillType = 'teach' | 'learn';
export type FilterMode = 'all' | 'wantToLearn' | 'canTeach';
export type Gender = 'male' | 'female' | 'Мужской' | 'Женский';

export interface SkillAuthor {
  id: number;
  name: string;
  avatar: string;
}

export interface Subcategory {
  id: number;
  title: string;
}

export interface Skill {
  id: number;
  title: string;
  icon: string;
  slug?: SkillCategorySlug;
  subcategories: Subcategory[];
}

export interface SkillOffer {
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

export interface UserSkillTag {
  name: string;
  category?: SkillCategorySlug;
}

export interface UserCardModel {
  id: number;
  name: string;
  avatar: string;
  city: string;
  birthday: string;
  skillsTeach: UserSkillTag[];
  skillsLearn: UserSkillTag[];
  isFavorite: boolean;
  likes: number;
}

export interface City {
  id: number;
  name: string;
}

export interface Filters {
  mode: FilterMode;
  skills: number[];
  gender: Gender | null;
  city: string[];
}

export interface UserTeachSkillDb {
  id: number;
  customTitle: string;
  subcategoryId: number;
  description: string;
  images: string[];
}

export interface UserDb {
  id: number;
  name: string;
  email?: string;
  password?: string;
  userAvatar: string;
  cityId: number;
  gender: Gender;
  birthday: string;
  about: string;
  skillsTeach: UserTeachSkillDb[];
  skillsLearn: number[];
  likes: number;
  createdAt: string;
}

export type UserFromDb = UserDb;

export interface UserTeachSkillEntry {
  userId: number;
  teachSkillId: number;
  title: string;
  subcategoryId: number;
  categoryTitle: string;
  subcategoryTitle: string;
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
