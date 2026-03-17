export type SkillCategorySlug =
  | 'education'
  | 'business'
  | 'art'
  | 'languages'
  | 'home'
  | 'health'
  | 'other';

export type SkillType = 'teach' | 'learn';

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
  skillsTeach: number[];
  skillsLearn: number[];
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
