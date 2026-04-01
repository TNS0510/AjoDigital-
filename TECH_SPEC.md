# Technical Specification: AjoDigital (Esusu) MVP

## 1. Architecture Overview
AjoDigital is a full-stack web application built with a modern, real-time architecture.

*   **Frontend**: React (Vite) with Tailwind CSS for styling and Framer Motion for animations.
*   **Backend**: Express.js server running on Node.js, handling complex business logic (e.g., rotation algorithms) and acting as a secure gateway.
*   **Database**: Firebase Firestore for real-time data synchronization and persistent storage.
*   **Authentication**: Firebase Authentication (Google OAuth) for secure user onboarding.
*   **Hosting**: Cloud Run (Containerized environment).

## 2. Database Schema (Firestore)

### `groups` (Collection)
*   `id`: string (Auto-generated)
*   `name`: string
*   `description`: string
*   `contributionAmount`: number (in NGN)
*   `frequency`: enum ("weekly", "monthly")
*   `totalMembers`: number
*   `organizerId`: string (Reference to `users.id`)
*   `status`: enum ("recruiting", "active", "completed")
*   `rotationOrder`: string[] (Ordered list of `userIds`)
*   `currentCycle`: number (1-indexed)
*   `startDate`: timestamp
*   `createdAt`: timestamp

### `memberships` (Collection)
*   `id`: string (Auto-generated)
*   `groupId`: string (Reference to `groups.id`)
*   `userId`: string (Reference to `users.id`)
*   `payoutTurn`: number (Index in rotation)
*   `status`: enum ("active", "completed")
*   `joinedAt`: timestamp

### `contributions` (Collection)
*   `id`: string (Auto-generated)
*   `groupId`: string (Reference to `groups.id`)
*   `userId`: string (Reference to `users.id`)
*   `cycleNumber`: number
*   `amount`: number
*   `status`: enum ("pending", "submitted", "verified", "flagged")
*   `proofUrl`: string (URL to uploaded screenshot)
*   `submittedAt`: timestamp
*   `verifiedAt`: timestamp
*   `verifiedBy`: string (Reference to `users.id`)

### `users` (Collection)
*   `id`: string (Firebase Auth UID)
*   `displayName`: string
*   `email`: string
*   `photoURL`: string
*   `role`: enum ("user", "admin")
*   `createdAt`: timestamp

## 3. API Routes (Express)

### Group Management
*   `POST /api/groups`: Create a new savings group.
*   `GET /api/groups`: List available groups (recruiting).
*   `GET /api/groups/:id`: Get detailed group state (members, rotation, status).
*   `POST /api/groups/:id/join`: Join a recruiting group.
*   `POST /api/groups/:id/start`: Initialize rotation and set start date (Organizer only).

### Contributions & Payouts
*   `POST /api/contributions/submit`: Upload proof of payment for a specific cycle.
*   `PATCH /api/contributions/:id/verify`: Approve or reject a payment proof (Organizer only).
*   `GET /api/contributions/pending`: List all unverified payments for an organizer.

### User Profile
*   `GET /api/users/me/dashboard`: Aggregate data for user's active groups, next payout date, and pending payments.

## 4. UI Screens

1.  **Landing Page**: Marketing site explaining the Ajo system and benefits.
2.  **Auth Page**: Simple Google Sign-in integration.
3.  **User Dashboard**: 
    *   "My Groups" grid.
    *   "Next Payout" countdown timer.
    *   "Action Required" list (e.g., "Pay ₦5,000 for Group X").
4.  **Create Group Form**: Step-by-step wizard for organizers.
5.  **Group Detail View**:
    *   **Rotation Timeline**: Visual progress bar of who has been paid.
    *   **Contribution Table**: Grid showing payment status for all members in the current cycle.
    *   **Payment Portal**: Upload area for proof of payment.
6.  **Organizer Admin Panel**: 
    *   Member management.
    *   Verification queue for incoming screenshots.

## 5. Folder Structure

```text
/
├── server.ts             # Express entry point
├── package.json          # Dependencies & Scripts
├── TECH_SPEC.md          # This document
├── PRD.md                # Product Requirements
├── src/
│   ├── main.tsx          # React entry point
│   ├── App.tsx           # Main Router & Layout
│   ├── components/       # UI Components
│   │   ├── ui/           # Atomic components (Buttons, Inputs)
│   │   ├── groups/       # Group-specific components
│   │   └── dashboard/    # Dashboard widgets
│   ├── services/         # Logic layer
│   │   ├── firebase.ts   # Firebase initialization
│   │   ├── api.ts        # Axios/Fetch wrappers
│   │   └── rotation.ts   # Rotation algorithm logic
│   ├── hooks/            # Custom React hooks (e.g., useAuth, useGroup)
│   ├── types/            # TypeScript interfaces
│   └── lib/              # Utilities (date formatting, currency)
└── public/               # Static assets
```

## 6. Key Technical Challenges
*   **Rotation Fairness**: Ensuring the algorithm is transparent and tamper-proof.
*   **Real-time Updates**: Using Firestore listeners to update the dashboard immediately when a payment is verified.
*   **Image Handling**: Securely managing proof-of-payment uploads (referencing external URLs or Firebase Storage).
