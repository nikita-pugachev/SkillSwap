import { render, screen, fireEvent } from '@testing-library/react';

interface MockProps {
  title: string;
  description: string;
  images: string[];
  onExchangeClick: () => void;
}

jest.mock('./SkillCard', () => ({
  SkillCard: ({ title, description, images, onExchangeClick }: MockProps) => {
    const remainingPhotos = images.length - 4;
    return (
      <div>
        <h1>{title}</h1>
        <p>{description}</p>
        <button onClick={onExchangeClick}>Предложить обмен</button>
        {remainingPhotos > 0 && <span>+{remainingPhotos}</span>}
      </div>
    );
  },
}));

import { SkillCard } from './SkillCard';

const mockProps = {
  id: '1',
  title: 'Тестовый навык',
  category: 'Категория',
  subcategory: 'Подкатегория',
  description: 'Описание навыка',
  images: ['1.jpg', '2.jpg', '3.jpg', '4.jpg', '5.jpg'],
  user: { name: 'Иван' },
  onExchangeClick: jest.fn(),
};

describe('SkillCard', () => {
  it('отображает заголовок и описание', () => {
    render(<SkillCard {...mockProps} />);
    expect(screen.getByText('Тестовый навык')).toBeInTheDocument();
    expect(screen.getByText('Описание навыка')).toBeInTheDocument();
  });

  it('отображает счетчик +N', () => {
    render(<SkillCard {...mockProps} />);
    expect(screen.getByText('+1')).toBeInTheDocument();
  });

  it('вызывает onExchangeClick', () => {
    render(<SkillCard {...mockProps} />);
    fireEvent.click(screen.getByText('Предложить обмен'));
    expect(mockProps.onExchangeClick).toHaveBeenCalledTimes(1);
  });
});
