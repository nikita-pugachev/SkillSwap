import type { Skill, UserFromDb } from './types';

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || `Ошибка загрузки: ${response.status}`);
  }
  return response.json();
}

export async function getSkills(): Promise<Skill[]> {
  try {
    const response = await fetch('/db/skills.json');
    return await handleResponse<Skill[]>(response);
  } catch (error) {
    console.error('Ошибка загрузки навыков:', error);
    throw error;
  }
}

export async function getUsersFromDb(): Promise<UserFromDb[]> {
  try {
    const response = await fetch('/db/users.json');
    const data = await handleResponse<{ users: UserFromDb[] }>(response);
    return data.users;
  } catch (error) {
    console.error('Ошибка загрузки пользователей:', error);
    throw error;
  }
}
