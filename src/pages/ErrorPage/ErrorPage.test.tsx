import type { ButtonHTMLAttributes } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ErrorPage } from './ErrorPage';
import { useNavigate, useParams } from 'react-router-dom';

const navigateMock = jest.fn();

jest.mock('react-router-dom', () => ({
  useNavigate: jest.fn(),
  useParams: jest.fn(),
}));

jest.mock('@/components/ui/ErrorPageUI', () => ({
  ErrorPageUI: ({ title, description }: { title: string; description: string }) => (
    <section data-testid="error-page-ui">
      <h1>{title}</h1>
      <p>{description}</p>
    </section>
  ),
}));

jest.mock('@/components/ui', () => ({
  Button: ({ children, ...props }: ButtonHTMLAttributes<HTMLButtonElement>) => (
    <button type="button" {...props}>
      {children}
    </button>
  ),
}));

jest.mock('@/pages/ErrorPage/model/errorConfig', () => ({
  errorConfig: {
    notFoundError: {
      title: 'Страница не найдена',
      description:
        'К сожалению, эта страница недоступна. Вернитесь на главную страницу или попробуйте позже',
    },
    serverError: {
      title: 'На сервере произошла ошибка',
      description: 'Попробуйте позже или вернитесь на главную страницу',
    },
  },
}));

const mockedUseNavigate = jest.mocked(useNavigate);
const mockedUseParams = jest.mocked(useParams);

describe('ErrorPage', () => {
  const renderPage = (type?: string) => {
    mockedUseParams.mockReturnValue(type ? ({ type } as never) : ({} as never));
    return render(<ErrorPage />);
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockedUseNavigate.mockReturnValue(navigateMock);
  });

  it('renders unknown error message when param type is missing', () => {
    renderPage();

    expect(screen.getByText('Неизвестная ошибка')).toBeInTheDocument();
    expect(screen.queryByTestId('error-page-ui')).not.toBeInTheDocument();
  });

  it('renders unknown error message when param type is invalid', () => {
    renderPage('randomError');

    expect(screen.getByText('Неизвестная ошибка')).toBeInTheDocument();
    expect(screen.queryByTestId('error-page-ui')).not.toBeInTheDocument();
  });

  it('renders notFoundError page content with action buttons', () => {
    renderPage('notFoundError');

    expect(screen.getByRole('heading', { name: 'Страница не найдена' })).toBeInTheDocument();

    expect(
      screen.getByText(
        'К сожалению, эта страница недоступна. Вернитесь на главную страницу или попробуйте позже'
      )
    ).toBeInTheDocument();

    expect(screen.getByRole('button', { name: 'Сообщить об ошибке' })).toBeInTheDocument();

    expect(screen.getByRole('button', { name: 'На главную' })).toBeInTheDocument();
  });

  it('renders serverError page content', () => {
    renderPage('serverError');

    expect(
      screen.getByRole('heading', { name: 'На сервере произошла ошибка' })
    ).toBeInTheDocument();

    expect(
      screen.getByText('Попробуйте позже или вернитесь на главную страницу')
    ).toBeInTheDocument();
  });

  it('navigates to home page when "На главную" button is clicked', async () => {
    const user = userEvent.setup();

    renderPage('notFoundError');

    await user.click(screen.getByRole('button', { name: 'На главную' }));

    expect(navigateMock).toHaveBeenCalledTimes(1);
    expect(navigateMock).toHaveBeenCalledWith('/');
  });

  it('does not navigate when "Сообщить об ошибке" button is clicked', async () => {
    const user = userEvent.setup();

    renderPage('notFoundError');

    await user.click(screen.getByRole('button', { name: 'Сообщить об ошибке' }));

    expect(navigateMock).not.toHaveBeenCalled();
  });

  it('does not render action buttons for unknown error', () => {
    renderPage('unknownType');

    expect(screen.queryByRole('button', { name: 'Сообщить об ошибке' })).not.toBeInTheDocument();

    expect(screen.queryByRole('button', { name: 'На главную' })).not.toBeInTheDocument();
  });
});
