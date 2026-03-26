import type { AuthUser, AuthUserGender } from '@/services/slices/authSlice';

const USERS_ENDPOINT = '/db/users.json';
const REGISTERED_USERS_KEY = 'registered_users';
const GENERATED_USER_ID_START = 1000;

type MockUserGender = 'male' | 'female';

export type MockUser = {
  id: number;
  name: string;
  email: string;
  password: string;
  userAvatar: string;
  city?: string;
  cityId?: number;
  gender?: MockUserGender;
  birthday?: string;
  about?: string;
};

type UsersResponse = {
  users: MockUser[];
};

const mapGenderToAuthUser = (gender?: MockUserGender): AuthUserGender | undefined => {
  switch (gender) {
    case 'male':
      return 'Мужской';
    case 'female':
      return 'Женский';
    default:
      return undefined;
  }
};

export const normalizeEmail = (email: string): string => email.trim().toLowerCase();

export const createMockToken = (userId: number): string => `mock-token-${userId}`;

export const toAuthUser = (user: MockUser): AuthUser => ({
  id: user.id,
  name: user.name,
  userAvatar: user.userAvatar,
  email: user.email,
  password: user.password,
  city: user.city,
  cityId: user.cityId,
  gender: mapGenderToAuthUser(user.gender),
  birthday: user.birthday,
  about: user.about,
});

export const getRegisteredUsers = (): MockUser[] => {
  const rawUsers = localStorage.getItem(REGISTERED_USERS_KEY);

  if (!rawUsers) {
    return [];
  }

  try {
    const parsedUsers = JSON.parse(rawUsers) as unknown;

    return Array.isArray(parsedUsers) ? (parsedUsers as MockUser[]) : [];
  } catch {
    return [];
  }
};

export const saveRegisteredUser = (user: MockUser): void => {
  const registeredUsers = getRegisteredUsers();

  localStorage.setItem(REGISTERED_USERS_KEY, JSON.stringify([...registeredUsers, user]));
};

export const getNextRegisteredUserId = (): number => {
  const registeredUsers = getRegisteredUsers();
  const maxRegisteredUserId = registeredUsers.reduce(
    (maxId, user) => Math.max(maxId, user.id),
    GENERATED_USER_ID_START
  );

  return maxRegisteredUserId + 1;
};

export const getAllUsers = async (): Promise<MockUser[]> => {
  const response = await fetch(USERS_ENDPOINT);

  if (!response.ok) {
    throw new Error('Failed to load users');
  }

  const data = (await response.json()) as UsersResponse;
  const usersFromFile = Array.isArray(data.users) ? data.users : [];

  return [...usersFromFile, ...getRegisteredUsers()];
};

export const isEmailTaken = async (email: string): Promise<boolean> => {
  const users = await getAllUsers();
  const normalizedEmail = normalizeEmail(email);

  return users.some((user) => normalizeEmail(user.email) === normalizedEmail);
};

export const findUserByCredentials = async (
  email: string,
  password: string
): Promise<MockUser | null> => {
  const users = await getAllUsers();
  const normalizedEmail = normalizeEmail(email);

  return (
    users.find(
      (user) => normalizeEmail(user.email) === normalizedEmail && user.password === password
    ) ?? null
  );
};

export const findUserById = async (id: number): Promise<MockUser | null> => {
  const users = await getAllUsers();

  return users.find((user) => user.id === id) ?? null;
};
