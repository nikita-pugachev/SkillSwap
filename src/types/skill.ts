export interface Subcategory {
  id: number;
  title: string;
}

export interface Skill {
  id: number;
  title: string;
  icon: string;
  subcategories: Subcategory[];
}
