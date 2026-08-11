import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import CreatePage from './create-page';

const selectOption = (label: string, optionName: string) => {
  const input = screen.getByLabelText(label) as HTMLInputElement;

  fireEvent.focus(input);

  if (input.value) {
    fireEvent.change(input, { target: { value: '' } });
  }

  fireEvent.click(screen.getByRole('option', { name: optionName }));
};

describe('CreatePage', () => {
  beforeEach(() => {
    jest.spyOn(console, 'log').mockImplementation(() => undefined);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('renders the form with a disabled subcategory field by default', () => {
    render(<CreatePage />);

    expect(screen.getByLabelText('Название навыка')).toBeInTheDocument();
    expect(screen.getByLabelText('Категория навыка')).toBeInTheDocument();
    expect(screen.getByLabelText('Подкатегория навыка')).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Создать навык' })).toBeDisabled();
  });

  it('switches the skill type using the shared radio group', () => {
    render(<CreatePage />);

    const teachRadio = screen.getByLabelText('Могу научить') as HTMLInputElement;
    const learnRadio = screen.getByLabelText('Хочу научиться') as HTMLInputElement;

    expect(teachRadio.checked).toBe(true);

    fireEvent.click(learnRadio);

    expect(learnRadio.checked).toBe(true);
    expect(teachRadio.checked).toBe(false);
  });

  it('enables the subcategory select after choosing a category', async () => {
    render(<CreatePage />);

    selectOption('Категория навыка', 'Бизнес и карьера');

    await waitFor(() => {
      expect(screen.getByLabelText('Подкатегория навыка')).not.toBeDisabled();
    });
  });

  it('resets the chosen subcategory when the category changes', async () => {
    render(<CreatePage />);

    selectOption('Категория навыка', 'Бизнес и карьера');
    selectOption('Подкатегория навыка', 'Управление командой');

    expect(screen.getByLabelText('Подкатегория навыка')).toHaveValue('Управление командой');

    selectOption('Категория навыка', 'Иностранные языки');

    await waitFor(() => {
      expect(screen.getByLabelText('Подкатегория навыка')).toHaveValue('');
    });
  });

  it('enables submit after required fields are filled including subcategory', async () => {
    render(<CreatePage />);

    fireEvent.change(screen.getByLabelText('Название навыка'), {
      target: { value: 'React mentor' },
    });
    selectOption('Категория навыка', 'Бизнес и карьера');
    selectOption('Подкатегория навыка', 'Управление командой');

    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'Создать навык' })).not.toBeDisabled();
    });
  });

  it('shows a validation error for an unsupported image type', async () => {
    render(<CreatePage />);

    const fileInput = screen.getByLabelText('Выбрать изображение') as HTMLInputElement;
    const file = new File(['test'], 'image.gif', { type: 'image/gif' });

    fireEvent.change(fileInput, { target: { files: [file] } });

    await waitFor(() => {
      expect(screen.getByText('Допустимы только JPEG и PNG изображения')).toBeInTheDocument();
    });
  });
});
