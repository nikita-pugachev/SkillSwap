import type { ButtonHTMLAttributes, InputHTMLAttributes, ReactNode } from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import RegisterPage from './register-page';

jest.mock('react-redux', () => ({
  useDispatch: jest.fn(),
}));

jest.mock('react-router-dom', () => {
  const actual = jest.requireActual('react-router-dom');

  return {
    ...actual,
    useNavigate: jest.fn(),
  };
});

jest.mock('@/components/ui', () => ({
  Button: ({
    children,
    type = 'button',
    ...props
  }: ButtonHTMLAttributes<HTMLButtonElement> & { children: ReactNode }) => (
    <button type={type} {...props}>
      {children}
    </button>
  ),
  InputUI: (props: InputHTMLAttributes<HTMLInputElement>) => <input {...props} />,
  InputBaseContainerUI: ({
    label,
    id,
    error,
    hint,
    children,
  }: {
    label: string;
    id: string;
    error?: string;
    hint?: string;
    children: ReactNode;
  }) => (
    <div>
      <label htmlFor={id}>{label}</label>
      {children}
      {error ? <span>{error}</span> : null}
      {!error && hint ? <span>{hint}</span> : null}
    </div>
  ),
  IconButton: ({
    ariaLabel,
    onClick,
    className,
  }: {
    ariaLabel: string;
    onClick?: () => void;
    className?: string;
  }) => (
    <button type="button" aria-label={ariaLabel} onClick={onClick} className={className}>
      icon
    </button>
  ),
}));

describe('RegisterPage', () => {
  const mockDispatch = jest.fn();
  const mockNavigate = jest.fn();
  const mockCities = [
    { id: 1, name: 'Moscow' },
    { id: 2, name: 'Saint Petersburg' },
    { id: 3, name: 'Novosibirsk' },
    { id: 4, name: 'Kazan' },
  ];
  const mockSkills = [
    {
      id: 1,
      title: 'Business',
      slug: 'business',
      icon: 'business.svg',
      subcategories: [
        { id: 101, title: 'Sales' },
        { id: 102, title: 'Negotiation' },
      ],
    },
    {
      id: 2,
      title: 'Languages',
      slug: 'languages',
      icon: 'languages.svg',
      subcategories: [{ id: 201, title: 'English' }],
    },
  ];

  const createFetchResponse = (data: unknown) =>
    Promise.resolve({
      ok: true,
      json: async () => data,
    });

  const createFetchMock = (users: unknown[] = []) =>
    jest.fn((input: string | URL | Request) => {
      const url =
        typeof input === 'string' ? input : input instanceof Request ? input.url : input.toString();

      if (url.includes('/db/cities.json')) {
        return createFetchResponse(mockCities);
      }

      if (url.includes('/db/skills.json')) {
        return createFetchResponse(mockSkills);
      }

      if (url.includes('/db/users.json')) {
        return createFetchResponse({ users });
      }

      throw new Error(`Unexpected fetch call: ${url}`);
    });

  const renderPage = async () => {
    render(<RegisterPage />);
    await waitFor(() => {
      expect(globalThis.fetch).toHaveBeenCalledTimes(2);
    });
  };

  const getSubmitButton = () =>
    screen.getAllByRole('button').find((button) => button.getAttribute('type') === 'submit') as
      | HTMLButtonElement
      | undefined;

  const getBackButton = () =>
    screen.getAllByRole('button').find((button) => button.textContent === 'Назад') as
      | HTMLButtonElement
      | undefined;

  const fillStepOne = async (user: ReturnType<typeof userEvent.setup>) => {
    await user.type(screen.getByLabelText('Email'), 'test@example.com');
    await user.type(screen.getByLabelText('Пароль'), 'password123');
    await user.type(screen.getByLabelText('Подтвердите пароль'), 'password123');
  };

  beforeEach(() => {
    (useDispatch as unknown as jest.Mock).mockReturnValue(mockDispatch);
    (useNavigate as jest.Mock).mockReturnValue(mockNavigate);
    mockDispatch.mockClear();
    mockNavigate.mockClear();
    localStorage.clear();
    globalThis.fetch = createFetchMock() as jest.Mock;
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.restoreAllMocks();
  });

  it('renders first registration step with email and password fields', async () => {
    await renderPage();

    expect(screen.getByRole('heading', { name: 'Шаг 1 из 3' })).toBeInTheDocument();
    expect(screen.getByLabelText('Email')).toBeInTheDocument();
    expect(screen.getByLabelText('Пароль')).toBeInTheDocument();
    expect(screen.getByLabelText('Подтвердите пароль')).toBeInTheDocument();
  });

  it('shows password hint on the first step', async () => {
    await renderPage();

    expect(screen.getByText('Пароль должен содержать не менее 6 символов')).toBeInTheDocument();
  });

  it('renders social buttons and the next action', async () => {
    await renderPage();

    expect(screen.getByRole('button', { name: 'Продолжить с Google' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Продолжить с Apple' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Далее' })).toBeInTheDocument();
  });

  it('toggles the password visibility', async () => {
    await renderPage();
    const passwordInput = screen.getByLabelText('Пароль') as HTMLInputElement;
    const toggleButton = screen.getByRole('button', { name: /показать пароль/i });

    expect(passwordInput).toHaveAttribute('type', 'password');

    fireEvent.click(toggleButton);
    expect(passwordInput).toHaveAttribute('type', 'text');
    expect(screen.getByRole('button', { name: /скрыть пароль/i })).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: /скрыть пароль/i }));
    expect(passwordInput).toHaveAttribute('type', 'password');
  });

  it('moves to the second step after valid first-step data', async () => {
    const user = userEvent.setup();

    await renderPage();
    await fillStepOne(user);

    await user.click(screen.getByRole('button', { name: 'Далее' }));

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: 'Шаг 2 из 3' })).toBeInTheDocument();
    });
  });

  it('moves back to the first step from step two', async () => {
    const user = userEvent.setup();

    await renderPage();
    await fillStepOne(user);

    await user.click(screen.getByRole('button', { name: 'Далее' }));

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: 'Шаг 2 из 3' })).toBeInTheDocument();
    });

    await user.click(screen.getByRole('button', { name: 'Назад' }));
    expect(screen.getByRole('heading', { name: 'Шаг 1 из 3' })).toBeInTheDocument();
  });

  it('renders step two fields after completing step one', async () => {
    const user = userEvent.setup();

    await renderPage();
    await fillStepOne(user);

    await user.click(screen.getByRole('button', { name: 'Далее' }));

    await waitFor(() => {
      expect(screen.getByLabelText('Имя')).toBeInTheDocument();
    });

    expect(screen.getByLabelText('Дата рождения')).toBeInTheDocument();
    expect(screen.getByLabelText('Пол')).toBeInTheDocument();
    expect(screen.getByLabelText('Город')).toBeInTheDocument();
    expect(
      screen.getByLabelText('Категория навыка, которому хотите научиться')
    ).toBeInTheDocument();
    expect(
      screen.getByLabelText('Подкатегория навыка, которому хотите научиться')
    ).toBeInTheDocument();
  });

  it.skip('legacy catalog-data scenario kept temporarily', async () => {
    const user = userEvent.setup();

    await renderPage();
    await fillStepOne(user);
    await user.click(screen.getByRole('button', { name: 'Р”Р°Р»РµРµ' }));

    await waitFor(() => {
      expect(screen.getByLabelText('РРјСЏ')).toBeInTheDocument();
    });

    const cityInput = screen.getByRole('combobox', { name: 'Р“РѕСЂРѕРґ' });
    fireEvent.focus(cityInput);

    expect(await screen.findByRole('option', { name: 'Novosibirsk' })).toBeInTheDocument();

    const learnCategoryInput = screen.getByRole('combobox', {
      name: 'РљР°С‚РµРіРѕСЂРёСЏ РЅР°РІС‹РєР°, РєРѕС‚РѕСЂРѕРјСѓ С…РѕС‚РёС‚Рµ РЅР°СѓС‡РёС‚СЊСЃСЏ',
    });
    const learnSubcategoryInput = screen.getByRole('combobox', {
      name: 'РџРѕРґРєР°С‚РµРіРѕСЂРёСЏ РЅР°РІС‹РєР°, РєРѕС‚РѕСЂРѕРјСѓ С…РѕС‚РёС‚Рµ РЅР°СѓС‡РёС‚СЊСЃСЏ',
    });

    expect(learnSubcategoryInput).toBeDisabled();

    await user.click(learnCategoryInput);
    await user.click(screen.getByRole('option', { name: 'Business' }));

    expect(learnSubcategoryInput).not.toBeDisabled();

    await user.click(learnSubcategoryInput);

    expect(screen.getByRole('option', { name: 'Sales' })).toBeInTheDocument();
    expect(screen.queryByRole('option', { name: 'English' })).not.toBeInTheDocument();
  });

  it('shows catalog-backed city and subcategory options', async () => {
    const user = userEvent.setup();

    await renderPage();
    await fillStepOne(user);
    await user.keyboard('{Enter}');

    await waitFor(() => {
      expect(screen.getAllByRole('combobox')).toHaveLength(4);
    });

    const [, cityInput, learnCategoryInput, learnSubcategoryInput] = screen.getAllByRole(
      'combobox'
    ) as HTMLInputElement[];

    fireEvent.focus(cityInput);

    expect(await screen.findByRole('option', { name: 'Novosibirsk' })).toBeInTheDocument();
    expect(learnSubcategoryInput).toBeDisabled();

    await user.click(learnCategoryInput);
    await user.click(screen.getByRole('option', { name: 'Business' }));

    expect(learnSubcategoryInput).not.toBeDisabled();

    await user.click(learnSubcategoryInput);

    expect(screen.getByRole('option', { name: 'Sales' })).toBeInTheDocument();
    expect(screen.queryByRole('option', { name: 'English' })).not.toBeInTheDocument();
  });

  it.skip('legacy navigation persistence scenario', async () => {
    const user = userEvent.setup();

    await renderPage();
    await fillStepOne(user);
    await user.click(screen.getByRole('button', { name: 'Р”Р°Р»РµРµ' }));

    await waitFor(() => {
      expect(screen.getByLabelText('РРјСЏ')).toBeInTheDocument();
    });

    const [nameInput, birthDateInput] = screen.getAllByRole('textbox') as HTMLInputElement[];
    const [, cityInput, learnCategoryInput, learnSubcategoryInput] = screen.getAllByRole(
      'combobox'
    ) as HTMLInputElement[];

    await user.type(nameInput, 'Ivan');
    await user.type(birthDateInput, '01011990');

    await user.click(cityInput);
    await user.click(screen.getByRole('option', { name: 'Kazan' }));

    await user.click(learnCategoryInput);
    await user.click(screen.getByRole('option', { name: 'Business' }));

    await user.click(learnSubcategoryInput);
    await user.click(screen.getByRole('option', { name: 'Sales' }));

    await user.click(screen.getByRole('button', { name: 'РџСЂРѕРґРѕР»Р¶РёС‚СЊ' }));

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: 'РЁР°Рі 3 РёР· 3' })).toBeInTheDocument();
    });

    const [skillNameInput, descriptionInput] = screen.getAllByRole('textbox') as HTMLInputElement[];
    const [skillCategoryInput, skillSubcategoryInput] = screen.getAllByRole(
      'combobox'
    ) as HTMLInputElement[];

    await user.type(skillNameInput, 'Mentoring');
    await user.click(skillCategoryInput);
    await user.click(screen.getByRole('option', { name: 'Languages' }));
    await user.click(skillSubcategoryInput);
    await user.click(screen.getByRole('option', { name: 'English' }));
    await user.type(descriptionInput, 'Help with speaking');

    await user.click(screen.getByRole('button', { name: 'РќР°Р·Р°Рґ' }));

    await waitFor(() => {
      expect(screen.getByLabelText('РРјСЏ')).toBeInTheDocument();
    });

    const [nameInputAfterBack, birthDateInputAfterBack] = screen.getAllByRole(
      'textbox'
    ) as HTMLInputElement[];
    const [, cityInputAfterBack, learnCategoryInputAfterBack, learnSubcategoryInputAfterBack] =
      screen.getAllByRole('combobox') as HTMLInputElement[];

    expect(nameInputAfterBack).toHaveValue('Ivan');
    expect(birthDateInputAfterBack).toHaveValue('01.01.1990');
    expect(cityInputAfterBack).toHaveValue('Kazan');
    expect(learnCategoryInputAfterBack).toHaveValue('Business');
    expect(learnSubcategoryInputAfterBack).toHaveValue('Sales');

    await user.click(screen.getByRole('button', { name: 'РџСЂРѕРґРѕР»Р¶РёС‚СЊ' }));

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: 'РЁР°Рі 3 РёР· 3' })).toBeInTheDocument();
    });

    const [skillNameInputAfterForward, descriptionInputAfterForward] = screen.getAllByRole(
      'textbox'
    ) as HTMLInputElement[];
    const [skillCategoryInputAfterForward, skillSubcategoryInputAfterForward] = screen.getAllByRole(
      'combobox'
    ) as HTMLInputElement[];

    expect(skillNameInputAfterForward).toHaveValue('Mentoring');
    expect(descriptionInputAfterForward).toHaveValue('Help with speaking');
    expect(skillCategoryInputAfterForward).toHaveValue('Languages');
    expect(skillSubcategoryInputAfterForward).toHaveValue('English');
  });

  it.skip('legacy reload persistence scenario', async () => {
    const user = userEvent.setup();

    localStorage.setItem('registerStep', '3');
    localStorage.setItem(
      'registerFormValues',
      JSON.stringify({
        name: 'Saved User',
        email: 'saved@example.com',
        password: 'password123',
        confirmPassword: 'password123',
        birthDate: '01.01.1990',
        gender: null,
        city: { id: 4, name: 'Kazan' },
        learnCategory: { id: 1, name: 'Business' },
        learnSubcategory: { id: 101, name: 'Sales' },
        skillName: 'Saved skill',
        skillCategory: { id: 2, name: 'Languages' },
        skillSubcategory: { id: 201, name: 'English' },
        description: 'Saved description',
      })
    );

    await renderPage();

    expect(screen.getByRole('heading', { name: 'РЁР°Рі 3 РёР· 3' })).toBeInTheDocument();

    const [skillNameInput, descriptionInput] = screen.getAllByRole('textbox') as HTMLInputElement[];
    const [skillCategoryInput, skillSubcategoryInput] = screen.getAllByRole(
      'combobox'
    ) as HTMLInputElement[];

    await waitFor(() => {
      expect(skillCategoryInput).toHaveValue('Languages');
      expect(skillSubcategoryInput).toHaveValue('English');
    });

    expect(skillNameInput).toHaveValue('Saved skill');
    expect(descriptionInput).toHaveValue('Saved description');
    expect(skillCategoryInput).toHaveValue('Languages');
    expect(skillSubcategoryInput).toHaveValue('English');

    await user.click(screen.getByRole('button', { name: 'РќР°Р·Р°Рґ' }));

    await waitFor(() => {
      expect(screen.getByLabelText('РРјСЏ')).toBeInTheDocument();
    });

    const [nameInput, birthDateInput] = screen.getAllByRole('textbox') as HTMLInputElement[];
    const [, cityInput, learnCategoryInput, learnSubcategoryInput] = screen.getAllByRole(
      'combobox'
    ) as HTMLInputElement[];

    expect(nameInput).toHaveValue('Saved User');
    expect(birthDateInput).toHaveValue('01.01.1990');
    expect(cityInput).toHaveValue('Kazan');
    expect(learnCategoryInput).toHaveValue('Business');
    expect(learnSubcategoryInput).toHaveValue('Sales');

    await user.click(screen.getByRole('button', { name: 'РќР°Р·Р°Рґ' }));

    expect(screen.getByLabelText('Email')).toHaveValue('saved@example.com');
    expect(screen.getByLabelText('РџР°СЂРѕР»СЊ')).toHaveValue('password123');
    expect(screen.getByLabelText('РџРѕРґС‚РІРµСЂРґРёС‚Рµ РїР°СЂРѕР»СЊ')).toHaveValue('password123');
  });

  it('keeps draft values while moving between the second and third steps', async () => {
    const user = userEvent.setup();

    await renderPage();
    await fillStepOne(user);

    const submitStepOne = getSubmitButton();
    expect(submitStepOne).toBeDefined();
    await user.click(submitStepOne!);

    await waitFor(() => {
      expect(screen.getAllByRole('combobox')).toHaveLength(4);
    });

    const [nameInput, birthDateInput] = screen.getAllByRole('textbox') as HTMLInputElement[];
    const [, cityInput, learnCategoryInput, learnSubcategoryInput] = screen.getAllByRole(
      'combobox'
    ) as HTMLInputElement[];

    await user.type(nameInput, 'Ivan');
    await user.type(birthDateInput, '01011990');

    await user.click(cityInput);
    await user.click(screen.getByRole('option', { name: 'Kazan' }));

    await user.click(learnCategoryInput);
    await user.click(screen.getByRole('option', { name: 'Business' }));

    await user.click(learnSubcategoryInput);
    await user.click(screen.getByRole('option', { name: 'Sales' }));

    const submitStepTwo = getSubmitButton();
    expect(submitStepTwo).toBeDefined();
    await user.click(submitStepTwo!);

    await waitFor(() => {
      expect(screen.getAllByRole('combobox')).toHaveLength(2);
    });

    const [skillNameInput, descriptionInput] = screen.getAllByRole('textbox') as HTMLInputElement[];
    const [skillCategoryInput, skillSubcategoryInput] = screen.getAllByRole(
      'combobox'
    ) as HTMLInputElement[];

    await user.type(skillNameInput, 'Mentoring');
    await user.click(skillCategoryInput);
    await user.click(screen.getByRole('option', { name: 'Languages' }));
    await user.click(skillSubcategoryInput);
    await user.click(screen.getByRole('option', { name: 'English' }));
    await user.type(descriptionInput, 'Help with speaking');

    const backFromStepThree = getBackButton();
    expect(backFromStepThree).toBeDefined();
    await user.click(backFromStepThree!);

    await waitFor(() => {
      expect(screen.getAllByRole('combobox')).toHaveLength(4);
    });

    const [nameInputAfterBack, birthDateInputAfterBack] = screen.getAllByRole(
      'textbox'
    ) as HTMLInputElement[];
    const [, cityInputAfterBack, learnCategoryInputAfterBack, learnSubcategoryInputAfterBack] =
      screen.getAllByRole('combobox') as HTMLInputElement[];

    expect(nameInputAfterBack).toHaveValue('Ivan');
    expect(birthDateInputAfterBack).toHaveValue('01.01.1990');
    expect(cityInputAfterBack).toHaveValue('Kazan');
    expect(learnCategoryInputAfterBack).toHaveValue('Business');
    expect(learnSubcategoryInputAfterBack).toHaveValue('Sales');

    const submitStepTwoAgain = getSubmitButton();
    expect(submitStepTwoAgain).toBeDefined();
    await user.click(submitStepTwoAgain!);

    await waitFor(() => {
      expect(screen.getAllByRole('combobox')).toHaveLength(2);
    });

    const [skillNameInputAfterForward, descriptionInputAfterForward] = screen.getAllByRole(
      'textbox'
    ) as HTMLInputElement[];
    const [skillCategoryInputAfterForward, skillSubcategoryInputAfterForward] = screen.getAllByRole(
      'combobox'
    ) as HTMLInputElement[];

    expect(skillNameInputAfterForward).toHaveValue('Mentoring');
    expect(descriptionInputAfterForward).toHaveValue('Help with speaking');
    expect(skillCategoryInputAfterForward).toHaveValue('Languages');
    expect(skillSubcategoryInputAfterForward).toHaveValue('English');
  });

  it('restores the registration draft from localStorage after reload', async () => {
    const user = userEvent.setup();

    localStorage.setItem('registerStep', '3');
    localStorage.setItem(
      'registerFormValues',
      JSON.stringify({
        name: 'Saved User',
        email: 'saved@example.com',
        password: 'password123',
        confirmPassword: 'password123',
        birthDate: '01.01.1990',
        gender: null,
        city: { id: 4, name: 'Kazan' },
        learnCategory: { id: 1, name: 'Business' },
        learnSubcategory: { id: 101, name: 'Sales' },
        skillName: 'Saved skill',
        skillCategory: { id: 2, name: 'Languages' },
        skillSubcategory: { id: 201, name: 'English' },
        description: 'Saved description',
      })
    );

    await renderPage();

    expect(screen.getAllByRole('combobox')).toHaveLength(2);

    const [skillNameInput, descriptionInput] = screen.getAllByRole('textbox') as HTMLInputElement[];
    const [skillCategoryInput, skillSubcategoryInput] = screen.getAllByRole(
      'combobox'
    ) as HTMLInputElement[];

    await waitFor(() => {
      expect(skillCategoryInput).toHaveValue('Languages');
      expect(skillSubcategoryInput).toHaveValue('English');
    });

    expect(skillNameInput).toHaveValue('Saved skill');
    expect(descriptionInput).toHaveValue('Saved description');
    expect(skillCategoryInput).toHaveValue('Languages');
    expect(skillSubcategoryInput).toHaveValue('English');

    const backToStepTwo = getBackButton();
    expect(backToStepTwo).toBeDefined();
    await user.click(backToStepTwo!);

    await waitFor(() => {
      expect(screen.getAllByRole('combobox')).toHaveLength(4);
    });

    const [nameInput, birthDateInput] = screen.getAllByRole('textbox') as HTMLInputElement[];
    const [, cityInput, learnCategoryInput, learnSubcategoryInput] = screen.getAllByRole(
      'combobox'
    ) as HTMLInputElement[];

    expect(nameInput).toHaveValue('Saved User');
    expect(birthDateInput).toHaveValue('01.01.1990');
    expect(cityInput).toHaveValue('Kazan');
    expect(learnCategoryInput).toHaveValue('Business');
    expect(learnSubcategoryInput).toHaveValue('Sales');

    const backToStepOne = getBackButton();
    expect(backToStepOne).toBeDefined();
    await user.click(backToStepOne!);

    await waitFor(() => {
      expect(screen.getByLabelText('Email')).toHaveValue('saved@example.com');
    });

    expect(screen.getByLabelText('Пароль')).toHaveValue('password123');
    expect(screen.getByLabelText('Подтвердите пароль')).toHaveValue('password123');
  });

  it('renders step three fields after completing step two', async () => {
    const user = userEvent.setup();

    await renderPage();
    await fillStepOne(user);

    await user.click(screen.getByRole('button', { name: 'Далее' }));

    await waitFor(() => {
      expect(screen.getByLabelText('Имя')).toBeInTheDocument();
    });

    await user.type(screen.getByLabelText('Имя'), 'Иван');
    await user.click(screen.getByRole('button', { name: 'Продолжить' }));

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: 'Шаг 3 из 3' })).toBeInTheDocument();
    });

    expect(screen.getByLabelText('Название навыка')).toBeInTheDocument();
    expect(screen.getByLabelText('Категория навыка')).toBeInTheDocument();
    expect(screen.getByLabelText('Подкатегория навыка')).toBeInTheDocument();
    expect(screen.getByLabelText('Описание')).toBeInTheDocument();
  });

  it('shows inline validation errors for empty first-step fields', async () => {
    const user = userEvent.setup();

    await renderPage();

    await user.click(screen.getByRole('button', { name: 'Далее' }));

    expect(await screen.findByText('Введите email')).toBeInTheDocument();
    expect(await screen.findByText('Введите пароль')).toBeInTheDocument();
    expect(await screen.findByText('Подтвердите пароль', { selector: 'span' })).toBeInTheDocument();
  });

  it('shows mismatch error when passwords are different', async () => {
    const user = userEvent.setup();

    await renderPage();

    await user.type(screen.getByLabelText('Email'), 'test@example.com');
    await user.type(screen.getByLabelText('Пароль'), 'password123');
    await user.type(screen.getByLabelText('Подтвердите пароль'), 'password321');
    await user.click(screen.getByRole('button', { name: 'Далее' }));

    expect(await screen.findByText('Пароли не совпадают')).toBeInTheDocument();
  });

  it('shows duplicate email error when user already exists', async () => {
    const user = userEvent.setup();

    (globalThis.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => ({
        users: [
          {
            id: 1,
            name: 'Иван',
            email: 'test@example.com',
            password: 'password123',
            userAvatar: '/src/assets/user-avatars/ivan.png',
          },
        ],
      }),
    });

    await renderPage();
    await fillStepOne(user);
    await user.click(screen.getByRole('button', { name: 'Далее' }));

    expect(
      await screen.findByText('Пользователь с таким email уже существует')
    ).toBeInTheDocument();
  });

  it('shows name validation error on the second step', async () => {
    const user = userEvent.setup();

    await renderPage();
    await fillStepOne(user);
    await user.click(screen.getByRole('button', { name: 'Далее' }));

    await waitFor(() => {
      expect(screen.getByLabelText('Имя')).toBeInTheDocument();
    });

    await user.click(screen.getByRole('button', { name: 'Продолжить' }));

    expect(await screen.findByText('Введите имя')).toBeInTheDocument();
  });

  it('creates account, logs in user and redirects after successful registration', async () => {
    const user = userEvent.setup();

    await renderPage();
    await fillStepOne(user);
    await user.click(screen.getByRole('button', { name: 'Далее' }));

    await waitFor(() => {
      expect(screen.getByLabelText('Имя')).toBeInTheDocument();
    });

    await user.type(screen.getByLabelText('Имя'), 'Иван');
    await user.click(screen.getByRole('button', { name: 'Продолжить' }));

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: 'Шаг 3 из 3' })).toBeInTheDocument();
    });

    await user.click(screen.getByRole('button', { name: 'Продолжить' }));

    await waitFor(() => {
      expect(mockDispatch).toHaveBeenCalled();
      expect(mockNavigate).toHaveBeenCalledWith('/', { replace: true });
    });

    expect(localStorage.getItem('token')).toBe('mock-token-1001');
    expect(JSON.parse(localStorage.getItem('auth_user') ?? 'null')).toEqual({
      id: 1001,
      name: 'Иван',
      userAvatar: 'test-file-stub',
      email: 'test@example.com',
      password: 'password123',
    });
    expect(JSON.parse(localStorage.getItem('registered_users') ?? '[]')).toEqual([
      expect.objectContaining({
        id: 1001,
        name: 'Иван',
        email: 'test@example.com',
        password: 'password123',
        userAvatar: 'test-file-stub',
      }),
    ]);
  });
});
