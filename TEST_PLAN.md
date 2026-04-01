# AjoDigital Test Plan

This document outlines the testing strategy and core features to be verified for the AjoDigital (Esusu) platform.

## 1. Core Features Checklist

### Authentication
- [ ] User can sign in with Google.
- [ ] User profile is created in Firestore on first login.
- [ ] User can sign out.
- [ ] Protected routes redirect unauthenticated users to the login page.

### Group Management
- [ ] User can create a new savings group with specific financials (amount, frequency, max members).
- [ ] Group creation requires a name and description.
- [ ] Organizer is automatically added as the first member.
- [ ] Users can discover and join "recruiting" groups.
- [ ] Groups transition from "recruiting" to "active" when the organizer starts the rotation.

### Rotation & Payouts
- [ ] Rotation order is randomly shuffled when the group starts.
- [ ] Each member is assigned a unique payout turn (0 to N-1).
- [ ] The current recipient is correctly identified for each cycle.
- [ ] Recipient bank details are only visible to the organizer during their payout turn.

### Contributions
- [ ] Members can submit proof of payment (URL) for their cycle contribution.
- [ ] Organizers can verify or flag submitted contributions.
- [ ] Cycle completion logic correctly increments the cycle number.
- [ ] Group status transitions to "completed" after the final cycle.

## 2. Testing Strategy

### Unit Tests (`vitest`)
- **Location**: `src/**/*.test.ts`
- **Focus**: Pure logic, utility functions, and data transformations.
- **Example**: `src/lib/rotation.test.ts` verifies the shuffling and recipient identification logic.

### Component Tests (`@testing-library/react`)
- **Location**: `src/**/*.test.tsx`
- **Focus**: UI rendering, user interactions, and state changes.
- **Example**: `src/pages/CreateGroup.test.tsx` verifies form validation and step navigation.

### Integration Tests
- **Focus**: End-to-end flows involving multiple components and mocked Firebase interactions.
- **Example**: Joining a group -> Submitting proof -> Organizer verification.

## 3. Running Tests

```bash
# Run all tests
npm test

# Run tests in UI mode
npm run test:ui
```

## 4. Test Results & Coverage

| Test File | Status | Coverage |
|-----------|--------|----------|
| `src/lib/rotation.test.ts` | ✅ Passed | 100% Core Logic |
| `src/pages/CreateGroup.test.tsx` | ✅ Passed | Form & Navigation |
| `src/pages/GroupDetail.test.tsx` | ✅ Passed | Data Fetching, Join, Start, Proof |
| `src/pages/Dashboard.test.tsx` | ✅ Passed | Group Listing |
| `src/pages/Profile.test.tsx` | ✅ Passed | Profile Updates |

## 5. Future Testing Roadmap
- [ ] **E2E Testing**: Implement Playwright or Cypress for full browser-based flows.
- [ ] **Security Rules Testing**: Use the Firebase Emulator Suite to test `firestore.rules` against unauthorized access attempts.
- [ ] **Performance Testing**: Verify UI responsiveness with large numbers of contributions or members.
