import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '../test/test-utils';
import Profile from './Profile';

// Mock Firestore
vi.mock('firebase/firestore', () => ({
  doc: vi.fn((db, coll, id) => ({ path: `${coll}/${id}` })),
  updateDoc: vi.fn(() => Promise.resolve()),
}));

describe('Profile Component', () => {
  it('renders profile form with initial data', () => {
    render(<Profile />);
    
    expect(screen.getByText(/Your Profile/i)).toBeInTheDocument();
    expect(screen.getByDisplayValue(/Test User/i)).toBeInTheDocument();
    expect(screen.getByDisplayValue(/test@example.com/i)).toBeInTheDocument();
  });

  it('updates profile data on submit', async () => {
    const { updateDoc } = await import('firebase/firestore');
    render(<Profile />);

    const displayNameInput = screen.getByLabelText(/Display Name/i);
    const bankNameInput = screen.getByLabelText(/Bank Name/i);
    const accountNumberInput = screen.getByLabelText(/Account Number/i);
    const accountNameInput = screen.getByLabelText(/Account Name/i);

    fireEvent.change(displayNameInput, { target: { value: 'Updated Name' } });
    fireEvent.change(bankNameInput, { target: { value: 'New Bank' } });
    fireEvent.change(accountNumberInput, { target: { value: '0987654321' } });
    fireEvent.change(accountNameInput, { target: { value: 'New Account Name' } });

    const saveButton = screen.getByText(/Save Profile/i);
    fireEvent.click(saveButton);

    await waitFor(() => {
      expect(updateDoc).toHaveBeenCalledWith(
        expect.objectContaining({ path: 'users/test-user-id' }),
        expect.objectContaining({
          displayName: 'Updated Name',
          bankDetails: {
            bankName: 'New Bank',
            accountNumber: '0987654321',
            accountName: 'New Account Name'
          }
        })
      );
    });
  });
});
