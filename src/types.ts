export type GroupFrequency = 'daily' | 'weekly' | 'monthly';
export type GroupStatus = 'recruiting' | 'active' | 'completed';
export type ContributionStatus = 'pending' | 'submitted' | 'verified' | 'flagged';

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
  bankDetails?: {
    accountNumber: string;
    bankName: string;
    accountName: string;
  };
  createdAt: number;
}

export interface Group {
  id: string;
  name: string;
  description: string;
  organizerUid: string;
  contributionAmount: number;
  frequency: GroupFrequency;
  maxMembers: number;
  currentMemberCount: number;
  status: GroupStatus;
  rotationOrder: string[]; // Array of UIDs
  currentCycle: number; // 0-indexed
  startDate?: number;
  createdAt: number;
}

export interface Membership {
  id: string;
  groupId: string;
  userUid: string;
  displayName: string;
  photoURL?: string;
  bankDetails?: {
    accountNumber: string;
    bankName: string;
    accountName: string;
  };
  payoutTurn: number; // 0-indexed
  joinedAt: number;
  status: 'active' | 'left';
}

export interface Contribution {
  id: string;
  groupId: string;
  userUid: string;
  cycleNumber: number;
  amount: number;
  status: ContributionStatus;
  proofUrl?: string;
  submittedAt?: number;
  verifiedAt?: number;
  verifiedBy?: string;
  createdAt: number;
}

export interface Payout {
  id: string;
  groupId: string;
  userUid: string;
  cycleNumber: number;
  amount: number;
  status: 'pending' | 'disbursed';
  disbursedAt?: number;
  createdAt: number;
}
