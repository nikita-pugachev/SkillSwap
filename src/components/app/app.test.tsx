import { render, screen } from '@testing-library/react';
import Root from './app';

describe('App', () => {
  it('renders the SkillSwap heading', () => {
    render(<Root />);
    expect(screen.getByRole('heading', { name: /SkillSwap/i })).toBeInTheDocument();
  });
});
