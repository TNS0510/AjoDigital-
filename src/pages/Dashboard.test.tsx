import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor } from '../test/test-utils';
import Dashboard from './Dashboard';

// Mock Data
const mockGroups = [
  { id: 'g1', name: 'My Active Group', contributionAmount: 5000, status: 'active', currentMemberCount: 5, maxMembers: 10, frequency: 'monthly', description: 'Test' },
  { id: 'g2', name: 'Recruiting Group', contributionAmount: 10000, status: 'recruiting', currentMemberCount: 2, maxMembers: 5, frequency: 'weekly', description: 'Test', organizerUid: 'other-user' }
];

const mockMemberships = [
  { id: 'm1', groupId: 'g1', userUid: 'test-user-id', status: 'active' }
];

// Mock Firestore
vi.mock('firebase/firestore', () => ({
  collection: vi.fn((db, coll) => ({ path: coll })),
  query: vi.fn((ref) => ref),
  where: vi.fn(),
  onSnapshot: vi.fn((ref, callback) => {
    if (ref.path === 'memberships') {
      callback({ docs: mockMemberships.map(m => ({ data: () => m })) });
    } else if (ref.path === 'groups') {
      callback({ docs: mockGroups.filter(g => g.status === 'recruiting').map(g => ({ data: () => g })) });
    }
    return vi.fn();
  }),
  getDocs: vi.fn((q) => {
    if (q.path === 'groups') {
      return Promise.resolve({ docs: mockGroups.filter(g => g.id === 'g1').map(g => ({ data: () => g })) });
    }
    return Promise.resolve({ docs: [] });
  }),
}));

describe('Dashboard Component', () => {
  it('renders dashboard with active and recruiting groups', async () => {
    render(<Dashboard />);
    
    // Check loading state initially
    expect(screen.getByRole('status', { hidden: true }) || screen.getByTestId('loading-spinner') || document.querySelector('.animate-spin')).toBeInTheDocument();

    await waitFor(() => {
      // Use heading role to distinguish from section title
      expect(screen.getByRole('heading', { name: 'My Active Group' })).toBeInTheDocument();
      expect(screen.getByRole('heading', { name: 'Recruiting Group' })).toBeInTheDocument();
    });

    expect(screen.getByText(/Hello, Test/i)).toBeInTheDocument();
    // Use getAllByText or be more specific for stats
    expect(screen.getAllByText(/Active Groups/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/₦5,000/i).length).toBeGreaterThan(0);
  });

  it('shows empty state when no active groups', async () => {
    const { onSnapshot, getDocs } = await import('firebase/firestore');
    
    // Override mocks for this test
    (onSnapshot as any).mockImplementationOnce((ref, callback) => {
      if (ref.path === 'memberships') {
        callback({ docs: [] });
      }
      return vi.fn();
    });

    render(<Dashboard />);

    await waitFor(() => {
      expect(screen.getByText(/You haven't joined any groups yet/i)).toBeInTheDocument();
    });
  });
});
