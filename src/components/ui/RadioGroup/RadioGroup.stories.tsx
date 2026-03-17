import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { RadioGroup } from './RadioGroup';
import { useState } from 'react';

const meta: Meta<typeof RadioGroup> = {
  title: 'UI/RadioGroup',
  component: RadioGroup,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    value: {
      control: 'text',
      description: 'Текущее выбранное значение',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

// Группа с заголовком и интерактивная группа с управлением состояния
export const Default: Story = {
  render: (args) => {
    const [selectedValue, setSelectedValue] = useState<string | null>('any');

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <RadioGroup
          {...args}
          value={selectedValue}
          onChange={(value) => {
            setSelectedValue(value);
            args.onChange?.(value);
          }}
        />
      </div>
    );
  },
  args: {
    legend: 'Пол автора',
    name: 'gender',
    items: [
      { label: 'Не имеет значения', value: 'any' },
      { label: 'Мужской', value: 'male' },
      { label: 'Женский', value: 'female' },
    ],
    onChange: fn(),
  },
  parameters: {
    docs: {
      description: {
        story: 'Группа с заголовком и интерактивная группа с управлением состояния.',
      },
    },
  },
};
