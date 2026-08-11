import { render, screen } from '@testing-library/react';
import type { SVGProps } from 'react';

import { ErrorPageUI } from './ErrorPageUI';

const MockIllustration = (props: SVGProps<SVGSVGElement>) => (
  <svg data-testid="error-illustration" {...props}>
    <title>Mock Illustration</title>
  </svg>
);

describe('ErrorPageUI', () => {
  it('renders title, description and illustration', () => {
    render(
      <ErrorPageUI
        Illustration={MockIllustration}
        title="Тестовый заголовок"
        description="Тестовое описание"
      />
    );

    expect(screen.getByRole('heading', { name: 'Тестовый заголовок' })).toBeInTheDocument();
    expect(screen.getByText('Тестовое описание')).toBeInTheDocument();
    expect(screen.getByTestId('error-illustration')).toBeInTheDocument();
  });

  it('passes className to illustration component', () => {
    render(
      <ErrorPageUI Illustration={MockIllustration} title="Заголовок" description="Описание" />
    );

    const illustration = screen.getByTestId('error-illustration');
    expect(illustration).toHaveAttribute('class');
    expect(illustration.getAttribute('class')).toContain('illustration-svg');
  });
});
