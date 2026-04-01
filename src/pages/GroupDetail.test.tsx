import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '../test/test-utils';
import GroupDetail from './GroupDetail';
import * as firestore from 'firebase/firestore';

// Mock Group Data
const mockGroup = {
  id: 'group-1',
  name: 'Test Group',
  organizerUid: 'test-user-id',
  maxMembers: 3,
  currentMemberCount: 3,
  status: 'active',
  currentCycle: 0,
  contributionAmount: 10000,
  rotationOrder: ['test-user-id', 'user-2', 'user-3'],
  frequency: 'monthly'
};

// Mock Memberships
const mockMemberships = [
  { id: 'm1', userUid: 'test-user-id', displayName: 'Organizer', photoURL: '', bankDetails: { bankName: 'Test Bank', accountNumber: '123', accountName: 'Org' }, payoutTurn: 0, groupId: 'group-1', joinedAt: Date.now(), status: 'active' },
  { id: 'm2', userUid: 'user-2', displayName: 'Member 2', photoURL: '', payoutTurn: 1, groupId: 'group-1', joinedAt: Date.now(), status: 'active' },
  { id: 'm3', userUid: 'user-3', displayName: 'Member 3', photoURL: '', payoutTurn: 2, groupId: 'group-1', joinedAt: Date.now(), status: 'active' }
];

// Mock Profiles
const mockProfiles = [
  { uid: 'test-user-id', displayName: 'Organizer', bankDetails: { bankName: 'Test Bank', accountNumber: '123', accountName: 'Org' } },
  { uid: 'user-2', displayName: 'Member 2' },
  { uid: 'user-3', displayName: 'Member 3' }
];

// Mock Data Variables
let currentMockGroup = { ...mockGroup };
let currentMockMemberships = [...mockMemberships];

vi.mock('firebase/firestore', () => ({
  getFirestore: vi.fn(),
  writeBatch: vi.fn(() => ({
    set: vi.fn(),
    update: vi.fn(),
    commit: vi.fn().mockResolvedValue(undefined)
  })),
  onSnapshot: vi.fn((ref, callback) => {
    const path = ref.path || '';
    if (path === 'groups/group-1' || path === 'group-1') {
      callback({ exists: () => true, id: 'group-1', data: () => currentMockGroup });
    } else if (path === 'memberships') {
      callback({ 
        docs: currentMockMemberships
          .filter(m => m.groupId === 'group-1')
          .map(m => ({ id: m.id, data: () => m })) 
      });
    } else if (path === 'contributions') {
      callback({ docs: [] });
    } else if (path === 'users') {
      callback({ docs: mockProfiles.map(p => ({ id: p.uid, data: () => p })) });
    }
    return vi.fn();
  }),
  doc: vi.fn((db, coll, id) => ({ path: id ? `${coll}/${id}` : coll, id })),
  collection: vi.fn((db, coll) => ({ path: coll })),
  query: vi.fn((ref) => ref),
  where: vi.fn(),
  updateDoc: vi.fn(),
  setDoc: vi.fn(),
  getDocs: vi.fn((q) => {
    if (q && q.path === 'users') {
      return Promise.resolve({ docs: mockProfiles.map(p => ({ id: p.uid, data: () => p })) });
    }
    return Promise.resolve({ docs: [] });
  }),
  increment: vi.fn((n) => ({ type: 'increment', value: n })),
  arrayUnion: vi.fn((...args) => ({ type: 'arrayUnion', value: args })),
}));

describe('GroupDetail Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    currentMockGroup = { ...mockGroup };
    currentMockMemberships = [...mockMemberships];
    // Mock window.prompt
    vi.stubGlobal('prompt', vi.fn());
  });

  it('renders group details and shows organizer actions', async () => {
    render(<GroupDetail />);

    await waitFor(() => {
      expect(screen.getByText(/Test Group/i)).toBeInTheDocument();
    });

    // Check if organizer sections are visible
    expect(screen.getByText(/Recipient Bank Details/i)).toBeInTheDocument();
  });

  it('allows a non-member to join a recruiting group', async () => {
    currentMockGroup.status = 'recruiting';
    currentMockGroup.currentMemberCount = 1;
    currentMockMemberships = [mockMemberships[0]]; // Only organizer

    render(<GroupDetail />, { 
      authContext: { 
        user: { uid: 'user-2', email: 'user2@example.com' }, 
        profile: { uid: 'user-2', displayName: 'User 2', email: 'user2@example.com', createdAt: Date.now() },
        loading: false 
      } 
    });

    await waitFor(() => {
      expect(screen.getByText(/Join Group/i)).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText(/Join Group/i));
    
    await waitFor(() => {
      expect(firestore.writeBatch).toHaveBeenCalled();
    });
  });

  it('allows organizer to start rotation when enough members joined', async () => {
    currentMockGroup.status = 'recruiting';
    currentMockGroup.currentMemberCount = 2;
    currentMockMemberships = [mockMemberships[0], mockMemberships[1]];

    render(<GroupDetail />);

    await waitFor(() => {
      expect(screen.getByText(/Start Rotation/i)).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText(/Start Rotation/i));

    await waitFor(() => {
      expect(firestore.updateDoc).toHaveBeenCalledWith(
        expect.objectContaining({ id: 'group-1' }),
        expect.objectContaining({ status: 'active' })
      );
    });
  });

  it('allows member to submit contribution proof', async () => {
    // Mock prompt to return a URL
    vi.mocked(window.prompt).mockReturnValue('https://example.com/proof.jpg');

    render(<GroupDetail />, {
      authContext: { 
        user: { uid: 'user-2', email: 'user2@example.com' }, 
        profile: { uid: 'user-2', displayName: 'User 2', email: 'user2@example.com', createdAt: Date.now() },
        loading: false 
      }
    });

    await waitFor(() => {
      expect(screen.getByText(/Submit Proof/i)).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText(/Submit Proof/i));

    await waitFor(() => {
      expect(firestore.setDoc).toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining({
          proofUrl: 'https://example.com/proof.jpg',
          status: 'submitted'
        })
      );
    });
  });
});
