import type { Meta, StoryObj } from '@storybook/react-vite';
import { Avatar } from './Avatar';

const meta: Meta<typeof Avatar> = {
  title: 'UI/Avatar',
  component: Avatar,
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: 'radio',
      options: ['sm', 'md', 'lg'],
    },
  },
};

export default meta;

type Story = StoryObj<typeof Avatar>;

export const WithImage: Story = {
  args: {
    src: 'https://i.pravatar.cc/150?img=3',
    name: 'Иван Иванов',
    size: 'md',
  },
};

export const Fallback: Story = {
  args: {
    name: 'Иван Иванов',
    size: 'md',
  },
};

export const Small: Story = {
  args: {
    name: 'Мария Петрова',
    size: 'sm',
  },
};

export const Large: Story = {
  args: {
    name: 'Алексей Сидоров',
    size: 'lg',
  },
};
