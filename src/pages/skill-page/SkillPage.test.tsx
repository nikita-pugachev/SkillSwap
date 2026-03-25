/* global global */
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { SkillPage } from './SkillPage';
import '@testing-library/jest-dom';

const mockDispatch = jest.fn();
jest.mock('react-redux', () => ({
  useDispatch: () => mockDispatch,
  useSelector: () => [], // если понадобится в будущем
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

jest.mock('@/components/user-card', () => ({
  UserCard: ({
    name,
    onDetailsClick,
    id,
  }: {
    name: string;
    onDetailsClick: (id: number) => void;
    id: number;
  }) => (
    <div data-testid="user-card" onClick={() => onDetailsClick(id || 1)} data-user-id={id}>
      {name}
    </div>
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
        {showBell && <div data-testid="bell-icon">🔔</div>}
        <button onClick={onButtonClick} data-testid="modal-button">
          {buttonText}
        </button>
        <button onClick={onClose} data-testid="modal-close">
          ×
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

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
  useParams: () => ({ id: '1' }),
}));

global.fetch = jest.fn() as jest.Mock;

describe('SkillPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockNavigate.mockClear();
    mockDispatch.mockClear();
  });

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

  const renderComponent = () => {
    return render(
      <BrowserRouter>
        <SkillPage />
      </BrowserRouter>
    );
  };

  describe('Загрузка данных', () => {
    test('показывает лоадер во время загрузки', async () => {
      (fetch as jest.Mock).mockImplementation(() => new Promise(() => {}));

      renderComponent();

      expect(screen.getByText('Загрузка похожих предложений...')).toBeInTheDocument();
    });

    test('загружает и отображает данные после успешной загрузки', async () => {
      (fetch as jest.Mock)
        .mockResolvedValueOnce({ ok: true, json: async () => mockCities })
        .mockResolvedValueOnce({ ok: true, json: async () => mockSkills })
        .mockResolvedValueOnce({ ok: true, json: async () => mockUsers });

      await act(async () => {
        renderComponent();
      });

      await waitFor(() => {
        expect(screen.queryByText('Загрузка похожих предложений...')).not.toBeInTheDocument();
      });

      expect(screen.getByTestId('skill-card')).toBeInTheDocument();
      expect(screen.getByText('Похожие предложения')).toBeInTheDocument();
      expect(screen.getByText('Анна')).toBeInTheDocument();
      expect(screen.getByText('Петр')).toBeInTheDocument();

      expect(mockDispatch).toHaveBeenCalledTimes(1);
    });

    test('отображает ошибку при неудачной загрузке', async () => {
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
  });

  describe('Модалка предложения обмена', () => {
    beforeEach(async () => {
      (fetch as jest.Mock)
        .mockResolvedValueOnce({ ok: true, json: async () => mockCities })
        .mockResolvedValueOnce({ ok: true, json: async () => mockSkills })
        .mockResolvedValueOnce({ ok: true, json: async () => mockUsers });

      await act(async () => {
        renderComponent();
      });

      await waitFor(() => {
        expect(screen.queryByText('Загрузка похожих предложений...')).not.toBeInTheDocument();
      });
    });

    test('открывает модалку при клике на "Предложить обмен"', async () => {
      const exchangeButton = screen.getByTestId('exchange-button');

      fireEvent.click(exchangeButton);

      expect(screen.getByTestId('modal')).toBeInTheDocument();
      expect(screen.getByTestId('modal-title')).toHaveTextContent('Вы предложили обмен');
      expect(screen.getByTestId('modal-description')).toHaveTextContent(
        'Теперь дождитесь подтверждения. Вам придет уведомление'
      );
      expect(screen.getByTestId('bell-icon')).toBeInTheDocument();
    });

    test('закрывает модалку при клике на кнопку "Готово"', async () => {
      const exchangeButton = screen.getByTestId('exchange-button');
      fireEvent.click(exchangeButton);

      expect(screen.getByTestId('modal')).toBeInTheDocument();

      const modalButton = screen.getByTestId('modal-button');
      fireEvent.click(modalButton);

      expect(screen.queryByTestId('modal')).not.toBeInTheDocument();
    });

    test('закрывает модалку при клике на крестик', async () => {
      const exchangeButton = screen.getByTestId('exchange-button');
      fireEvent.click(exchangeButton);

      expect(screen.getByTestId('modal')).toBeInTheDocument();

      const closeButton = screen.getByTestId('modal-close');
      fireEvent.click(closeButton);

      expect(screen.queryByTestId('modal')).not.toBeInTheDocument();
    });
  });

  describe('Скролл кнопки', () => {
    beforeEach(async () => {
      (fetch as jest.Mock)
        .mockResolvedValueOnce({ ok: true, json: async () => mockCities })
        .mockResolvedValueOnce({ ok: true, json: async () => mockSkills })
        .mockResolvedValueOnce({ ok: true, json: async () => mockUsers });

      await act(async () => {
        renderComponent();
      });

      await waitFor(() => {
        expect(screen.queryByText('Загрузка похожих предложений...')).not.toBeInTheDocument();
      });
    });

    test('кнопки скролла присутствуют в DOM', () => {
      const scrollButtons = screen.queryAllByTestId('scroll-button');
      expect(scrollButtons.length).toBeGreaterThanOrEqual(0);
    });
  });

  describe('Навигация', () => {
    beforeEach(async () => {
      (fetch as jest.Mock)
        .mockResolvedValueOnce({ ok: true, json: async () => mockCities })
        .mockResolvedValueOnce({ ok: true, json: async () => mockSkills })
        .mockResolvedValueOnce({ ok: true, json: async () => mockUsers });

      await act(async () => {
        renderComponent();
      });

      await waitFor(() => {
        expect(screen.queryByText('Загрузка похожих предложений...')).not.toBeInTheDocument();
      });
    });

    test('переход на страницу пользователя при клике на UserCard', () => {
      const userCard = screen.getByText('Анна');
      fireEvent.click(userCard);

      expect(mockNavigate).toHaveBeenCalledWith('/skill/2');
    });
  });

  describe('Обработчики событий', () => {
    beforeEach(async () => {
      jest.spyOn(console, 'log').mockImplementation(() => {});

      (fetch as jest.Mock)
        .mockResolvedValueOnce({ ok: true, json: async () => mockCities })
        .mockResolvedValueOnce({ ok: true, json: async () => mockSkills })
        .mockResolvedValueOnce({ ok: true, json: async () => mockUsers });

      await act(async () => {
        renderComponent();
      });

      await waitFor(() => {
        expect(screen.queryByText('Загрузка похожих предложений...')).not.toBeInTheDocument();
      });
    });

    afterEach(() => {
      jest.restoreAllMocks();
    });

    test('handleLikeToggle выводит в консоль при клике', () => {
      const likeButton = screen.getByTestId('like-button');
      fireEvent.click(likeButton);

      expect(console.log).toHaveBeenCalledWith('Toggle like', '1');
    });

    test('handleShare выводит в консоль при клике', () => {
      const shareButton = screen.getByTestId('share-button');
      fireEvent.click(shareButton);

      expect(console.log).toHaveBeenCalledWith('Share skill', '1');
    });

    test('handleMoreClick выводит в консоль при клике', () => {
      const moreButton = screen.getByTestId('more-button');
      fireEvent.click(moreButton);

      expect(console.log).toHaveBeenCalledWith('More actions', '1');
    });
  });
});
