import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';

import { getUsers } from '@/utils/api';
import type { UserDb } from '@/utils/types';

jest.mock('@/utils/api', () => ({
  getUsers: jest.fn(),
}));

jest.mock('@/components/widgets', () => ({
  Header: ({
    isAuthenticated,
    user,
    searchValue,
  }: {
    isAuthenticated?: boolean;
    user?: { name: string; avatar: string };
    searchValue?: string;
  }) => (
    <div data-testid="header">
      <span data-testid="auth-state">{String(Boolean(isAuthenticated))}</span>
      <span data-testid="auth-name">{user?.name ?? ''}</span>
      <span data-testid="auth-avatar">{user?.avatar ?? ''}</span>
      <span data-testid="search-value">{searchValue ?? ''}</span>
    </div>
  ),
  Footer: () => <div data-testid="footer" />,
}));

import Layout from './layout';

const mockedGetUsers = getUsers as jest.MockedFunction<typeof getUsers>;

const authUser: UserDb = {
  id: 7,
  name: 'Анна',
  userAvatar: '/anna.png',
  cityId: 1,
  gender: 'Женский',
  birthday: '1999-02-14',
  about: 'О себе',
  skillsTeach: [],
  skillsLearn: [],
  likes: 0,
  createdAt: '2026-02-01',
};

const renderLayout = () =>
  render(
    <MemoryRouter initialEntries={['/']}>
      <Routes>
        <Route element={<Layout variant="main" withFooter />}>
          <Route path="/" element={<div>Catalog page</div>} />
        </Route>
      </Routes>
    </MemoryRouter>
  );

describe('Layout', () => {
  beforeEach(() => {
    localStorage.clear();
    mockedGetUsers.mockReset();
  });

  it('loads header auth state from localStorage automatically', async () => {
    localStorage.setItem('token', 'mock-token');
    localStorage.setItem('userId', String(authUser.id));
    mockedGetUsers.mockResolvedValue([authUser]);

    renderLayout();

    expect(screen.getByTestId('auth-state')).toHaveTextContent('true');
    expect(screen.getByText('Catalog page')).toBeInTheDocument();
    expect(screen.getByTestId('footer')).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByTestId('auth-name')).toHaveTextContent(authUser.name);
    });

    expect(screen.getByTestId('auth-avatar')).toHaveTextContent(authUser.userAvatar);
  });
});
