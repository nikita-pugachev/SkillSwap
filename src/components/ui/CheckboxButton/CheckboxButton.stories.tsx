import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';

import { CheckboxButton } from './CheckboxButton';

const meta: Meta<typeof CheckboxButton> = {
  title: 'UI/CheckboxButton',
  component: CheckboxButton,
  tags: ['autodocs'],
  args: {
    label: 'Выбрать навык',
    state: 'empty',
    onChange: fn(),
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Checked: Story = {
  args: {
    state: 'checked',
  },
};

export const Indeterminate: Story = {
  args: {
    state: 'indeterminate',
  },
};
