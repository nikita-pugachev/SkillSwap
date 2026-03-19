import { Skill } from '../types/skill';

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || `HTTP error! status: ${response.status}`);
  }
  return response.json();
}

export async function getSkills(): Promise<Skill[]> {
  try {
    const response = await fetch('/db/skills.json');
    return handleResponse<Skill[]>(response);
  } catch (error) {
    console.error('Ошибка загрузки навыков:', error);
    throw error;
  }
}
