export type SkillCategorySlug =
  | 'education'
  | 'business'
  | 'art'
  | 'languages'
  | 'home'
  | 'health'
  | 'other';

export type SkillType = 'teach' | 'learn';
export type FilterMode = 'all' | 'wantToLearn' | 'canTeach';
export type Gender = 'Мужской' | 'Женский';

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
