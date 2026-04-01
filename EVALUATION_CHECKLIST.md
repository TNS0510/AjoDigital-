# AjoDigital (Esusu) MVP Evaluation Checklist

This checklist defines the measurable pass/fail criteria for the AjoDigital application across four key pillars: Functionality, Security, Performance, and User Experience (UX).

## 1. Functionality
| Feature | Requirement | Pass/Fail Criteria |
|---------|-------------|-------------------|
| **Authentication** | Google Login integration | **Pass:** User can sign in via Google popup and see their profile. |
| **Profile Management** | Bank details storage | **Pass:** User can save/update Bank Name, Account Number, and Account Name in Profile. |
| **Group Creation** | Create savings group | **Pass:** Organizer can set name, amount, frequency, and max members. |
| **Group Joining** | Join recruiting group | **Pass:** Non-members can join until `maxMembers` is reached. |
| **Rotation Logic** | Automated shuffling | **Pass:** Organizer can start rotation; system shuffles members and assigns payout turns. |
| **Contributions** | Proof of payment | **Pass:** Members can upload/link proof of payment for the current cycle. |
| **Verification** | Organizer approval | **Pass:** Organizer can verify or flag submitted contributions. |
| **Cycle Management** | Move to next recipient | **Pass:** Organizer can complete a cycle, incrementing `currentCycle` and updating the recipient. |

## 2. Security
| Area | Requirement | Pass/Fail Criteria |
|------|-------------|-------------------|
| **Data Access** | Firestore Rules | **Pass:** `firestore.rules` prevents non-owners from reading PII (emails) in `/users`. |
| **Role Protection** | Organizer privileges | **Pass:** Only the `organizerUid` can verify contributions or start rotations. |
| **Atomic Writes** | Membership integrity | **Pass:** Joining a group uses `writeBatch` to ensure `currentMemberCount` and `membership` doc are in sync. |
| **Input Validation** | Schema enforcement | **Pass:** Firestore rules reject documents with missing required fields or invalid data types (e.g., negative amounts). |
| **PII Protection** | Denormalization | **Pass:** Bank details are denormalized into `memberships` only for group visibility, keeping the main profile private. |

## 3. Performance
| Metric | Requirement | Pass/Fail Criteria |
|--------|-------------|-------------------|
| **Initial Load** | App boot time | **Pass:** Application renders the dashboard in < 2 seconds on a standard 4G connection. |
| **Real-time Sync** | Data reactivity | **Pass:** Contribution status updates appear on other members' screens in < 500ms via `onSnapshot`. |
| **Optimistic UI** | Interaction feedback | **Pass:** Buttons show "Joining..." or "Submitting..." states immediately upon click. |
| **Image Loading** | Referrer policy | **Pass:** External images (proofs/avatars) load without 403 errors using `no-referrer`. |

## 4. User Experience (UX)
| Element | Requirement | Pass/Fail Criteria |
|---------|-------------|-------------------|
| **Responsiveness** | Mobile-first design | **Pass:** All screens (Dashboard, Group Detail, Profile) are fully functional on mobile viewports (375px width). |
| **Navigation** | Breadcrumbs/Back | **Pass:** Users can navigate back to the dashboard from any sub-page without losing state. |
| **Error Handling** | Error Boundaries | **Pass:** Firestore "Permission Denied" errors are caught and displayed as user-friendly messages, not raw JSON. |
| **Accessibility** | Touch targets | **Pass:** All interactive elements (buttons, inputs) have a minimum height/width of 44px. |
| **Visual Hierarchy** | Typography | **Pass:** Active recipient is clearly highlighted in the Group Detail view using distinct styling. |
