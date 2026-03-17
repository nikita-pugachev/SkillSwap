import { render, screen, fireEvent } from '@testing-library/react';

type MockRadioButtonProps = {
  label: string;
  name: string;
  value: string;
  checked: boolean;
  onChange: () => void;
};

jest.mock('@/components/ui/RadioButton', () => ({
  RadioButton: ({ label, name, value, checked, onChange }: MockRadioButtonProps) => (
    <label>
      <input type="radio" name={name} value={value} checked={checked} onChange={onChange} />
      {label}
    </label>
  ),
}));

import { RadioGroup } from './RadioGroup';

describe('RadioGroup', () => {
  const items = [
    { label: 'Option 1', value: '1' },
    { label: 'Option 2', value: '2' },
    { label: 'Option 3', value: '3' },
  ];

  const defaultProps = {
    name: 'test-radio',
    items,
    value: '1',
    onChange: jest.fn(),
  };

  test('renders fieldset', () => {
    render(<RadioGroup {...defaultProps} />);
    expect(screen.getByRole('group')).toBeInTheDocument();
  });

  test('renders legend', () => {
    render(<RadioGroup {...defaultProps} legend="Test legend" />);
    expect(screen.getByText('Test legend')).toBeInTheDocument();
  });

  test('renders all radio buttons', () => {
    render(<RadioGroup {...defaultProps} />);
    expect(screen.getByLabelText('Option 1')).toBeInTheDocument();
    expect(screen.getByLabelText('Option 2')).toBeInTheDocument();
    expect(screen.getByLabelText('Option 3')).toBeInTheDocument();
  });

  test('sets checked state', () => {
    render(<RadioGroup {...defaultProps} value="2" />);
    expect(screen.getByLabelText('Option 2')).toBeChecked();
  });

  test('calls onChange when clicked', () => {
    const onChange = jest.fn();

    render(<RadioGroup {...defaultProps} onChange={onChange} />);

    fireEvent.click(screen.getByLabelText('Option 2'));

    expect(onChange).toHaveBeenCalledWith('2');
  });
});
