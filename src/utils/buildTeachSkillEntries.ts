import type { Skill, UserFromDb, UserTeachSkillEntry } from './types';

type SubcategoryMeta = { categoryTitle: string; subcategoryTitle: string };

export function buildSubcategoryMeta(skills: Skill[]): Map<number, SubcategoryMeta> {
  const map = new Map<number, SubcategoryMeta>();
  for (const category of skills) {
    for (const sub of category.subcategories) {
      map.set(sub.id, {
        categoryTitle: category.title,
        subcategoryTitle: sub.title,
      });
    }
  }
  return map;
}

export function buildTeachSkillEntries(
  users: UserFromDb[],
  catalog: Skill[]
): UserTeachSkillEntry[] {
  const subMeta = buildSubcategoryMeta(catalog);
  const result: UserTeachSkillEntry[] = [];
  for (const user of users) {
    for (const teach of user.skillsTeach) {
      const meta = subMeta.get(teach.subcategoryId)!;
      result.push({
        userId: user.id,
        teachSkillId: teach.id,
        title: teach.customTitle,
        subcategoryId: teach.subcategoryId,
        categoryTitle: meta.categoryTitle,
        subcategoryTitle: meta.subcategoryTitle,
      });
    }
  }
  return result;
}
