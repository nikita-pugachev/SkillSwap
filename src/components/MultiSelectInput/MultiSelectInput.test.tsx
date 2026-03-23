import { useState, type ChangeEvent, type FC, type KeyboardEvent, type RefObject } from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';

import { MultiSelectInput, type TMultiSelectInputProps } from './MultiSelectInput';
import type { TSubcategoryOption } from '@/utils/types';

jest.mock('../../assets/icons/cross.svg', () => 'cross.svg');

type MockMultiSelectInputUIProps = {
  id: string;
  label?: string;
  placeholder?: string;
  disabled: boolean;
  noOptionsText: string;
  isOpen: boolean;
  rootRef: RefObject<HTMLDivElement | null>;
  inputRef: RefObject<HTMLInputElement | null>;
  inputValue: string;
  filteredOptions: TSubcategoryOption[];
  selectedIds: Set<number>;
  activeOptionIndex: number;
  actionAriaLabel: string;
  handleInputChange: (event: ChangeEvent<HTMLInputElement>) => void;
  handleInputFocus: () => void;
  handleInputKeyDown: (event: KeyboardEvent<HTMLInputElement>) => void;
  handleActionClick: () => void;
  handleToggleOption: (option: TSubcategoryOption) => void;
};

jest.mock('../ui', () => ({
  MultiSelectInputUI: (props: MockMultiSelectInputUIProps) => (
    <div ref={props.rootRef}>
      <input
        ref={props.inputRef}
        aria-label={props.label ?? props.id}
        value={props.inputValue}
        placeholder={props.placeholder}
        disabled={props.disabled}
        onChange={props.handleInputChange}
        onFocus={props.handleInputFocus}
        onKeyDown={props.handleInputKeyDown}
      />

      <button type="button" aria-label={props.actionAriaLabel} onClick={props.handleActionClick}>
        action
      </button>

      {props.isOpen ? (
        props.filteredOptions.length > 0 ? (
          <div>
            {props.filteredOptions.map((option) => (
              <button
                key={option.id}
                type="button"
                aria-pressed={props.selectedIds.has(option.id)}
                onClick={() => props.handleToggleOption(option)}
              >
                {option.title}
              </button>
            ))}
          </div>
        ) : (
          <span>{props.noOptionsText}</span>
        )
      ) : null}
    </div>
  ),
}));

type HarnessProps = Omit<TMultiSelectInputProps, 'isOpen' | 'onToggle'> & {
  initialOpen?: boolean;
};

const OPTIONS: TSubcategoryOption[] = [
  {
    id: 1,
    title: 'React',
    categoryId: 10,
    categoryTitle: 'Frontend',
  },
  {
    id: 2,
    title: 'NestJS',
    categoryId: 20,
    categoryTitle: 'Backend',
  },
  {
    id: 3,
    title: 'TypeScript',
    categoryId: 10,
    categoryTitle: 'Frontend',
  },
];

const Harness: FC<HarnessProps> = ({ initialOpen = false, ...props }) => {
  const [isOpen, setIsOpen] = useState(initialOpen);

  return (
    <MultiSelectInput {...props} isOpen={isOpen} onToggle={() => setIsOpen((prev) => !prev)} />
  );
};

const renderComponent = (props: Partial<HarnessProps> = {}) =>
  render(<Harness id="subcategory" options={OPTIONS} {...props} />);

beforeAll(() => {
  Object.defineProperty(globalThis, 'requestAnimationFrame', {
    writable: true,
    value: (callback: (time: number) => void): number => {
      callback(0);
      return 0;
    },
  });
});

describe('MultiSelectInput', () => {
  it('показывает defaultValue в инпуте, когда список закрыт', () => {
    renderComponent({
      defaultValue: [OPTIONS[0], OPTIONS[2]],
    });

    expect(screen.getByRole('textbox', { name: 'subcategory' })).toHaveValue('React, TypeScript');
  });

  it('фильтрует опции по categoryTitle', () => {
    renderComponent();

    const input = screen.getByRole('textbox', { name: 'subcategory' });

    fireEvent.focus(input);
    fireEvent.change(input, { target: { value: 'front' } });

    expect(screen.getByRole('button', { name: 'React' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'TypeScript' })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'NestJS' })).not.toBeInTheDocument();
  });

  it('выбирает опцию с клавиатуры', () => {
    const onChangeMock = jest.fn();

    const onChange: NonNullable<TMultiSelectInputProps['onChange']> = (options) => {
      onChangeMock(options);
    };

    renderComponent({ onChange });

    const input = screen.getByRole('textbox', { name: 'subcategory' });

    fireEvent.focus(input);
    fireEvent.keyDown(input, { key: 'ArrowDown' });
    fireEvent.keyDown(input, { key: 'Enter' });

    expect(onChangeMock).toHaveBeenCalledTimes(1);
    expect(onChangeMock).toHaveBeenLastCalledWith([OPTIONS[0]]);
  });

  it('очищает выбранные значения кнопкой action, когда список закрыт', () => {
    const onChangeMock = jest.fn();

    const onChange: NonNullable<TMultiSelectInputProps['onChange']> = (options) => {
      onChangeMock(options);
    };

    renderComponent({
      defaultValue: [OPTIONS[0], OPTIONS[1]],
      onChange,
    });

    fireEvent.click(screen.getByRole('button', { name: 'Очистить выбранные значения' }));

    expect(onChangeMock).toHaveBeenCalledTimes(1);
    expect(onChangeMock).toHaveBeenLastCalledWith([]);
    expect(screen.getByRole('textbox', { name: 'subcategory' })).toHaveValue('');
  });

  it('закрывает список по клику вне компонента и сбрасывает поиск', () => {
    renderComponent();

    const input = screen.getByRole('textbox', { name: 'subcategory' });

    fireEvent.focus(input);
    fireEvent.change(input, { target: { value: 'front' } });

    expect(input).toHaveValue('front');
    expect(screen.getByRole('button', { name: 'React' })).toBeInTheDocument();

    fireEvent.mouseDown(document.body);

    expect(screen.queryByRole('button', { name: 'React' })).not.toBeInTheDocument();
    expect(screen.getByRole('textbox', { name: 'subcategory' })).toHaveValue('');
  });
});
