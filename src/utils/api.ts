import type { City, SkillCategory, UserDb } from './types';

type FetchOptions = Parameters<typeof fetch>[1];

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || `Ошибка загрузки: ${response.status}`);
  }

  return response.json();
}

async function fetchJson<T>(url: string, init?: FetchOptions): Promise<T> {
  const response = await fetch(url, init);
  return handleResponse<T>(response);
}

export const getSkills = (init?: FetchOptions) =>
  fetchJson<SkillCategory[]>('/db/skills.json', init);

export const getCities = (init?: FetchOptions) => fetchJson<City[]>('/db/cities.json', init);

export const getUsers = async (init?: FetchOptions): Promise<UserDb[]> => {
  const response = await fetchJson<{ users: UserDb[] }>('/db/users.json', init);
  return response.users;
};
