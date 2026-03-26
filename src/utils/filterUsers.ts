import type { UserFromDb, Filters, City } from './types';

const genderMap = {
  Мужской: 'male',
  Женский: 'female',
} as const;

export function filterByGender(user: UserFromDb, gender: Filters['gender']): boolean {
  if (!gender) return true;
  return user.gender === genderMap[gender];
}

export function filterByCity(user: UserFromDb, cities: City[], selectedCities: string[]): boolean {
  if (selectedCities.length === 0) return true;
  const userCityName = cities.find((city) => city.id === user.cityId)?.name;
  return Boolean(userCityName && selectedCities.includes(userCityName));
}

export function filterByMode(user: UserFromDb, mode: Filters['mode'], skills: number[]): boolean {
  if (mode === 'wantToLearn') {
    return skills.length === 0 || user.skillsLearn.some((id) => skills.includes(id));
  }
  if (mode === 'canTeach') {
    return (
      skills.length === 0 || user.skillsTeach.some((skill) => skills.includes(skill.subcategoryId))
    );
  }
  return true;
}

export function filterUsers(users: UserFromDb[], filters: Filters, cities: City[]): UserFromDb[] {
  return users.filter(
    (user) =>
      filterByGender(user, filters.gender) &&
      filterByCity(user, cities, filters.city) &&
      filterByMode(user, filters.mode, filters.skills)
  );
}
