import type { Meta, StoryObj } from '@storybook/react-vite';
import { Button } from './ButtonUI';

const meta: Meta<typeof Button> = {
  title: 'UI/Button',
  component: Button,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'outlined', 'tertiary'],
      description: 'Вариант кнопки',
    },
    disabled: {
      control: 'boolean',
      description: 'Отключена ли кнопка',
    },
    onClick: { action: 'clicked' },
    children: {
      control: 'text',
      description: 'Содержимое кнопки',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    variant: 'primary',
    children: 'Primary',
  },
};

export const Outlined: Story = {
  args: {
    variant: 'outlined',
    children: 'Outlined',
  },
};

export const Tertiary: Story = {
  args: {
    variant: 'tertiary',
    children: 'Tertiary',
  },
};

export const PrimaryDisabled: Story = {
  args: {
    variant: 'primary',
    disabled: true,
    children: 'Primary disabled',
  },
  parameters: {
    docs: {
      description: {
        story: 'Первичная кнопка в состоянии disabled.',
      },
    },
  },
};

export const OutlinedDisabled: Story = {
  args: {
    variant: 'outlined',
    disabled: true,
    children: 'Outlined disabled',
  },
  parameters: {
    docs: {
      description: {
        story: 'Вторичная кнопка в состоянии disabled.',
      },
    },
  },
};
