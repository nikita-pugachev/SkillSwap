export interface SkillSubcategory {
  id: number;
  title: string;
}

export interface Skill {
  id: number;
  title: string;
  icon: string;
  subcategories: SkillSubcategory[];
}
