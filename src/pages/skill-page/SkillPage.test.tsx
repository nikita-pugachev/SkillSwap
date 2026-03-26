import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { BrowserRouter } from 'react-router-dom';
import { createRequest } from '@/services/slices/requestsSlice';
import { SkillPage } from './SkillPage';

const mockDispatch = jest.fn();
const mockNavigate = jest.fn();
const mockToastSuccess = jest.fn();
const mockUseAppSelector = jest.fn();

let mockState: {
  auth: {
    isAuthenticated: boolean;
    user: { id: number } | null;
  };
};

jest.mock('@/services/hooks', () => ({
  useAppDispatch: () => mockDispatch,
  useAppSelector: (selector: (state: typeof mockState) => unknown) => mockUseAppSelector(selector),
}));

jest.mock('react-hot-toast', () => ({
  __esModule: true,
  default: {
    success: (...args: unknown[]) => mockToastSuccess(...args),
  },
}));

jest.mock('@/components/ui/SkillCard/SkillCard', () => ({
  SkillCard: ({
    onExchangeClick,
    onLikeToggle,
    onShare,
    onMoreClick,
  }: {
    onExchangeClick: () => void;
    onLikeToggle: () => void;
    onShare: () => void;
    onMoreClick: () => void;
  }) => (
    <div data-testid="skill-card">
      <button onClick={onExchangeClick} data-testid="exchange-button">
        Предложить обмен
      </button>
      <button onClick={onLikeToggle} data-testid="like-button">
        Like
      </button>
      <button onClick={onShare} data-testid="share-button">
        Share
      </button>
      <button onClick={onMoreClick} data-testid="more-button">
        More
      </button>
    </div>
  ),
}));

jest.mock('@/components/ui/UserCard', () => ({
  UserCard: ({
    name,
    onDetailsClick,
    id,
  }: {
    name: string;
    onDetailsClick: (id: number) => void;
    id: number;
  }) => (
    <button type="button" data-testid="user-card" onClick={() => onDetailsClick(id)}>
      {name}
    </button>
  ),
}));

jest.mock('@/components/ui/Modal/Modal', () => ({
  Modal: ({
    isOpen,
    onClose,
    title,
    description,
    buttonText,
    onButtonClick,
    showBell,
  }: {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    description: string;
    buttonText: string;
    onButtonClick: () => void;
    showBell: boolean;
  }) =>
    isOpen ? (
      <div data-testid="modal">
        <div data-testid="modal-title">{title}</div>
        <div data-testid="modal-description">{description}</div>
        {showBell ? <div data-testid="bell-icon">bell</div> : null}
        <button onClick={onButtonClick} data-testid="modal-button">
          {buttonText}
        </button>
        <button onClick={onClose} data-testid="modal-close">
          x
        </button>
      </div>
    ) : null,
}));

jest.mock('@/components/ui/IconButton', () => ({
  IconButton: ({ onClick, ariaLabel }: { onClick: () => void; ariaLabel: string }) => (
    <button onClick={onClick} aria-label={ariaLabel} data-testid="scroll-button">
      {ariaLabel}
    </button>
  ),
}));

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
  useParams: () => ({ id: '1' }),
}));

globalThis.fetch = jest.fn() as jest.Mock;

const mockCities = [
  { id: 1, name: 'Москва' },
  { id: 2, name: 'Санкт-Петербург' },
];

const mockSkills = [
  {
    id: 1,
    title: 'Бизнес',
    slug: 'business',
    subcategories: [{ id: 106, title: 'Тайм-менеджмент' }],
  },
  {
    id: 2,
    title: 'Здоровье',
    slug: 'health',
    subcategories: [{ id: 601, title: 'Йога и медитация' }],
  },
  {
    id: 4,
    title: 'Творчество',
    slug: 'art',
    subcategories: [{ id: 404, title: 'Музыка и звук' }],
  },
];

const mockUsers = {
  users: [
    {
      id: 2,
      name: 'Анна',
      userAvatar: '/avatar.jpg',
      cityId: 1,
      birthday: '1995-07-15',
      skillsTeach: [{ subcategoryId: 404, customTitle: 'Музыка' }],
      skillsLearn: [106],
    },
    {
      id: 3,
      name: 'Петр',
      userAvatar: '/avatar2.jpg',
      cityId: 2,
      birthday: '1988-11-22',
      skillsTeach: [{ subcategoryId: 103, customTitle: 'Продажи' }],
      skillsLearn: [601],
    },
  ],
};

const setAuthState = (overrides?: Partial<(typeof mockState)['auth']>) => {
  mockState = {
    auth: {
      isAuthenticated: false,
      user: null,
      ...overrides,
    },
  };
};

const mockSuccessfulFetches = () => {
  (fetch as jest.Mock)
    .mockResolvedValueOnce({ ok: true, json: async () => mockCities })
    .mockResolvedValueOnce({ ok: true, json: async () => mockSkills })
    .mockResolvedValueOnce({ ok: true, json: async () => mockUsers });
};

const renderComponent = () =>
  render(
    <BrowserRouter>
      <SkillPage />
    </BrowserRouter>
  );

const renderLoadedPage = async () => {
  mockSuccessfulFetches();

  await act(async () => {
    renderComponent();
  });

  await waitFor(() => {
    expect(screen.getByTestId('skill-card')).toBeInTheDocument();
  });
};

describe('SkillPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    setAuthState();
    mockUseAppSelector.mockImplementation((selector: (state: typeof mockState) => unknown) =>
      selector(mockState)
    );
    window.history.replaceState({}, '', '/skill/1');
  });

  it('shows a loader while data is loading', () => {
    (fetch as jest.Mock).mockImplementation(() => new Promise(() => {}));

    renderComponent();

    expect(screen.getByText('Загрузка похожих предложений...')).toBeInTheDocument();
  });

  it('renders loaded data after successful requests', async () => {
    await renderLoadedPage();

    expect(screen.getByText('Похожие предложения')).toBeInTheDocument();
    expect(screen.getByText('Анна')).toBeInTheDocument();
    expect(screen.getByText('Петр')).toBeInTheDocument();
    expect(mockDispatch).toHaveBeenCalled();
  });

  it('shows an error when users request fails', async () => {
    (fetch as jest.Mock)
      .mockResolvedValueOnce({ ok: true, json: async () => mockCities })
      .mockResolvedValueOnce({ ok: true, json: async () => mockSkills })
      .mockRejectedValueOnce(new Error('Ошибка загрузки'));

    await act(async () => {
      renderComponent();
    });

    await waitFor(() => {
      expect(screen.getByText(/Ошибка:/)).toBeInTheDocument();
    });
  });

  it('redirects unauthenticated users to login when exchange is clicked', async () => {
    window.history.replaceState({}, '', '/skill/1?mode=offer#details');
    await renderLoadedPage();

    fireEvent.click(screen.getByTestId('exchange-button'));

    expect(mockNavigate).toHaveBeenCalledWith('/login', {
      state: {
        from: {
          pathname: '/skill/1',
          search: '?mode=offer',
          hash: '#details',
        },
      },
      replace: true,
    });
    expect(mockDispatch).not.toHaveBeenCalledWith(
      expect.objectContaining({ type: createRequest.type })
    );
    expect(mockToastSuccess).not.toHaveBeenCalled();
    expect(screen.queryByTestId('modal')).not.toBeInTheDocument();
  });

  it('creates a request, shows a toast, and opens the modal for authenticated users', async () => {
    setAuthState({ isAuthenticated: true, user: { id: 42 } });
    await renderLoadedPage();

    fireEvent.click(screen.getByTestId('exchange-button'));

    expect(mockDispatch).toHaveBeenCalledWith(
      expect.objectContaining({
        type: createRequest.type,
        payload: {
          skillId: '1',
          fromUserId: '42',
          toUserId: '1',
        },
      })
    );
    expect(mockToastSuccess).toHaveBeenCalledWith('Заявка на обмен успешно отправлена!', {
      duration: 3000,
    });
    expect(screen.getByTestId('modal')).toBeInTheDocument();
    expect(screen.getByTestId('bell-icon')).toBeInTheDocument();
  });

  it('closes the exchange modal when the action button is clicked', async () => {
    setAuthState({ isAuthenticated: true, user: { id: 42 } });
    await renderLoadedPage();

    fireEvent.click(screen.getByTestId('exchange-button'));
    fireEvent.click(screen.getByTestId('modal-button'));

    expect(screen.queryByTestId('modal')).not.toBeInTheDocument();
  });

  it('navigates to the selected user skill page', async () => {
    await renderLoadedPage();

    fireEvent.click(screen.getByText('Анна'));

    expect(mockNavigate).toHaveBeenCalledWith('/skill/2');
  });

  it('keeps existing like, share, and more handlers working', async () => {
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
    await renderLoadedPage();

    fireEvent.click(screen.getByTestId('like-button'));
    fireEvent.click(screen.getByTestId('share-button'));
    fireEvent.click(screen.getByTestId('more-button'));

    expect(consoleSpy).toHaveBeenCalledWith('Toggle like', '1');
    expect(consoleSpy).toHaveBeenCalledWith('Share skill', '1');
    expect(consoleSpy).toHaveBeenCalledWith('More actions', '1');

    consoleSpy.mockRestore();
  });
});
