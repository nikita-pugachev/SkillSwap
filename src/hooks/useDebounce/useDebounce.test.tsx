import { act, render, screen } from '@testing-library/react';
import { useState } from 'react';
import { useDebounce } from './useDebounce';

jest.useFakeTimers();

describe('useDebounce', () => {
  afterEach(() => {
    jest.clearAllTimers();
  });

  it('возвращает значение с задержкой', () => {
    const TestComponent = () => {
      const [value, setValue] = useState('React');
      const debouncedValue = useDebounce(value, 300);

      return (
        <>
          <button onClick={() => setValue('Redux')}>change</button>
          <span>{debouncedValue}</span>
        </>
      );
    };

    render(<TestComponent />);

    act(() => {
      screen.getByRole('button', { name: 'change' }).click();
    });

    expect(screen.getByText('React')).toBeInTheDocument();

    act(() => {
      jest.advanceTimersByTime(300);
    });

    expect(screen.getByText('Redux')).toBeInTheDocument();
  });

  it('при быстром изменении использует только последнее значение', () => {
    const TestComponent = () => {
      const [value, setValue] = useState('one');
      const debouncedValue = useDebounce(value, 300);

      return (
        <>
          <button onClick={() => setValue('two')}>two</button>
          <button onClick={() => setValue('three')}>three</button>
          <span>{debouncedValue}</span>
        </>
      );
    };

    render(<TestComponent />);

    act(() => {
      screen.getByRole('button', { name: 'two' }).click();
      jest.advanceTimersByTime(150);
      screen.getByRole('button', { name: 'three' }).click();
      jest.advanceTimersByTime(299);
    });

    expect(screen.getByText('one')).toBeInTheDocument();

    act(() => {
      jest.advanceTimersByTime(1);
    });

    expect(screen.getByText('three')).toBeInTheDocument();
  });

  it('очищает таймер при размонтировании', () => {
    const clearTimeoutSpy = jest.spyOn(window, 'clearTimeout');

    const TestComponent = () => {
      const debouncedValue = useDebounce('React', 300);
      return <span>{debouncedValue}</span>;
    };

    const { unmount } = render(<TestComponent />);

    unmount();

    expect(clearTimeoutSpy).toHaveBeenCalled();

    clearTimeoutSpy.mockRestore();
  });
});
