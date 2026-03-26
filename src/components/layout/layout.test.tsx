import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';

jest.mock('@/components/widgets', () => ({
  Header: ({ isAuthPage, searchValue }: { isAuthPage?: boolean; searchValue?: string }) => (
    <div data-testid="header">
      <span data-testid="is-auth-page">{String(Boolean(isAuthPage))}</span>
      <span data-testid="search-value">{searchValue ?? ''}</span>
    </div>
  ),
  Footer: () => <div data-testid="footer" />,
}));

import Layout from './layout';

const CATALOG_SEARCH_QUERY_STORAGE_KEY = 'catalogSearchQuery';

const renderLayout = () =>
  render(
    <MemoryRouter initialEntries={['/']}>
      <Routes>
        <Route element={<Layout variant="main" withFooter />}>
          <Route path="/" element={<div>Catalog page</div>} />
        </Route>
      </Routes>
    </MemoryRouter>
  );

describe('Layout', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('loads persisted catalog search query and passes main layout props to Header', () => {
    localStorage.setItem(CATALOG_SEARCH_QUERY_STORAGE_KEY, 'React');

    renderLayout();

    expect(screen.getByTestId('is-auth-page')).toHaveTextContent('false');
    expect(screen.getByTestId('search-value')).toHaveTextContent('React');
    expect(screen.getByText('Catalog page')).toBeInTheDocument();
    expect(screen.getByTestId('footer')).toBeInTheDocument();
  });
});
