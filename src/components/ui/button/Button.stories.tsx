import type { Meta, StoryObj } from '@storybook/react';
import { Button } from './Button';

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
type Story = StoryObj<typeof Button>;

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

export const Disabled: Story = {
  args: {
    disabled: true,
    children: 'Disabled',
  },
  parameters: {
    docs: {
      description: {
        story: 'Кнопка в состоянии disabled (применяется к любому варианту)',
      },
    },
  },
};
