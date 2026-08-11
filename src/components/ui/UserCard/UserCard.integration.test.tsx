import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import favoritesReducer from '@/services/slices/favoritesSlice';
import { UserCard } from './UserCard';
import { UserSkillTag, SkillCategorySlug } from '@/utils/types';

const createTestStore = (preloadedState = {}) =>
  configureStore({
    reducer: {
      favorites: favoritesReducer,
    },
    preloadedState,
  });

const mockTeachSkills: UserSkillTag[] = [
  { name: 'React', category: 'education' as SkillCategorySlug },
  { name: 'TypeScript', category: 'education' as SkillCategorySlug },
  { name: 'Node.js', category: 'other' as SkillCategorySlug },
];

const mockLearnSkills: UserSkillTag[] = [
  { name: 'Python', category: 'languages' as SkillCategorySlug },
  { name: 'Django', category: 'business' as SkillCategorySlug },
];

const defaultProps = {
  id: '1',
  name: 'Иван',
  avatar: '/avatar.png',
  city: 'Москва',
  birthday: '1998-01-01',
  skillsTeach: mockTeachSkills,
  skillsLearn: mockLearnSkills,
  likes: 0,
  isLogin: true,
  onDetailsClick: jest.fn(),
};

describe('UserCard — Redux integration', () => {
  it('переключает сердечко при клике (outline → filled → outline)', () => {
    const store = createTestStore({ favorites: { favoriteIds: [] } });

    render(
      <Provider store={store}>
        <MemoryRouter>
          <UserCard {...defaultProps} />
        </MemoryRouter>
      </Provider>
    );

    // добавить
    let button = screen.getByRole('button', { name: /добавить в избранное/i });
    expect(button).toBeInTheDocument();

    fireEvent.click(button);

    // удалить после клика
    button = screen.getByRole('button', { name: /удалить из избранного/i });
    expect(button).toBeInTheDocument();

    fireEvent.click(button);

    // исходное состояние
    expect(screen.getByRole('button', { name: /добавить в избранное/i })).toBeInTheDocument();
  });
});
