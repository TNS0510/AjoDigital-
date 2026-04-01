import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '../test/test-utils';
import CreateGroup from './CreateGroup';

describe('CreateGroup Component', () => {
  it('renders correctly and allows step navigation', async () => {
    render(<CreateGroup />);

    // Step 1
    expect(screen.getByText(/Start a New Group/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Group Name/i)).toBeInTheDocument();

    const nameInput = screen.getByPlaceholderText(/e.g. Lagos Techies Monthly Ajo/i);
    fireEvent.change(nameInput, { target: { value: 'Test Group' } });

    const nextButton = screen.getByText(/Next: Financials/i);
    fireEvent.click(nextButton);

    // Step 2
    expect(screen.getByText(/Contribution \(₦\)/i)).toBeInTheDocument();
    expect(screen.getByText(/Max Members/i)).toBeInTheDocument();
  });

  it('validates input before moving to step 2', () => {
    render(<CreateGroup />);
    const nextButton = screen.getByText(/Next: Financials/i);
    expect(nextButton).toBeDisabled();

    const nameInput = screen.getByPlaceholderText(/e.g. Lagos Techies Monthly Ajo/i);
    fireEvent.change(nameInput, { target: { value: 'Test Group' } });
    expect(nextButton).not.toBeDisabled();
  });
});
