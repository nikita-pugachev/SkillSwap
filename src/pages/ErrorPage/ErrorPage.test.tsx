import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ErrorPage } from './ErrorPage';
import { useNavigate, useParams } from 'react-router-dom';

jest.mock('react-router-dom', () => ({
  useNavigate: jest.fn(),
  useParams: jest.fn(),
}));

const mockedUseNavigate = useNavigate as jest.Mock;
const mockedUseParams = useParams as jest.Mock;

describe('ErrorPage', () => {
  const navigateMock = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    mockedUseNavigate.mockReturnValue(navigateMock);
  });

  it('renders unknown error message when param type is missing', () => {
    mockedUseParams.mockReturnValue({});

    render(<ErrorPage />);

    expect(screen.getByText('Неизвестная ошибка')).toBeInTheDocument();
  });

  it('renders unknown error message when param type is invalid', () => {
    mockedUseParams.mockReturnValue({ type: 'randomError' });

    render(<ErrorPage />);

    expect(screen.getByText('Неизвестная ошибка')).toBeInTheDocument();
  });

  it('renders notFoundError page content', () => {
    mockedUseParams.mockReturnValue({ type: 'notFoundError' });

    render(<ErrorPage />);

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
    mockedUseParams.mockReturnValue({ type: 'serverError' });

    render(<ErrorPage />);

    expect(
      screen.getByRole('heading', { name: 'На сервере произошла ошибка' })
    ).toBeInTheDocument();
    expect(
      screen.getByText('Попробуйте позже или вернитесь на главную страницу')
    ).toBeInTheDocument();
  });

  it('calls navigate("/") when "На главную" button is clicked', async () => {
    const user = userEvent.setup();
    mockedUseParams.mockReturnValue({ type: 'notFoundError' });

    render(<ErrorPage />);

    await user.click(screen.getByRole('button', { name: 'На главную' }));

    expect(navigateMock).toHaveBeenCalledTimes(1);
    expect(navigateMock).toHaveBeenCalledWith('/');
  });

  it('calls console.log when "Сообщить об ошибке" button is clicked', async () => {
    const user = userEvent.setup();
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
    mockedUseParams.mockReturnValue({ type: 'notFoundError' });

    render(<ErrorPage />);

    await user.click(screen.getByRole('button', { name: 'Сообщить об ошибке' }));

    expect(consoleSpy).toHaveBeenCalledTimes(1);
    expect(consoleSpy).toHaveBeenCalledWith('Перенаправляем...');

    consoleSpy.mockRestore();
  });

  it('does not render buttons for unknown error', () => {
    mockedUseParams.mockReturnValue({ type: 'unknownType' });

    render(<ErrorPage />);

    expect(screen.queryByRole('button', { name: 'Сообщить об ошибке' })).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'На главную' })).not.toBeInTheDocument();
  });
});
