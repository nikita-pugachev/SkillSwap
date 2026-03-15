import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { RadioButton } from './RadioButton';

const meta: Meta<typeof RadioButton> = {
  title: 'UI/RadioButton',
  component: RadioButton,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

// Базовая радио-кнопка в невыбранном состоянии.
export const Default: Story = {
  args: {
    label: 'Не выбрано',
    name: 'radio-button',
    value: 'none',
    checked: false,
    onChange: fn(),
  },
  parameters: {
    docs: {
      description: {
        story: 'Состояние по умолчанию - радио-кнопка не активна.',
      },
    },
  },
};

// Радио-кнопка в выбранном состоянии.
export const Checked: Story = {
  args: {
    label: 'Выбранно',
    name: 'radio-button',
    value: 'selected',
    checked: true,
    onChange: fn(),
  },
  parameters: {
    docs: {
      description: {
        story: 'Пример активной (выбранной) радио-кнопки.',
      },
    },
  },
};
