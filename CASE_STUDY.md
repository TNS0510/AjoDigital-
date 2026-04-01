# Case Study: AjoDigital (Esusu) MVP
## Modernizing Traditional Rotating Savings (Ajo/Esusu)

### 1. Problem
Traditional rotating savings schemes (Ajo in Nigeria, Esusu in other parts of West Africa) often rely on manual record-keeping, physical cash handling, and high levels of informal trust. This leads to:
- **Lack of Transparency:** Members cannot easily track who has paid or who is next in line.
- **Security Risks:** Physical cash handling is prone to theft or loss.
- **Limited Scalability:** Managing groups larger than a few people becomes administratively burdensome for the organizer.

### 2. Solution
**AjoDigital** is a decentralized, transparent, and secure digital platform for rotating savings. It digitizes the entire lifecycle of a savings group—from recruitment and contribution tracking to automated rotation and payout verification—providing a "trust-but-verify" model for modern communities.

### 3. Key Features
- **Real-time Group Management:** Organizers can create groups with custom contribution amounts, frequencies (daily, weekly, monthly), and member limits.
- **Automated Rotation:** A secure shuffling algorithm determines the payout order, ensuring fairness and transparency.
- **Proof of Contribution:** Members upload digital receipts for each cycle, which are then verified by the organizer.
- **Dynamic Payout Tracking:** Real-time dashboards show the current recipient, their bank details (denormalized for security), and the overall group progress.
- **Secure Authentication:** Integrated with Google Auth for seamless and verified user onboarding.

### 4. Tech Stack
- **Frontend:** React 19, Vite, Tailwind CSS, Lucide Icons.
- **State & Animation:** React Hooks, Framer Motion (Motion/React).
- **Backend:** Firebase (Firestore, Authentication).
- **Testing:** Vitest, React Testing Library.
- **Deployment:** Vercel (Frontend), Firebase CLI (Security Rules).

### 5. Challenges & Learnings
- **Data Privacy vs. Transparency:** A major challenge was allowing organizers to see payout recipients' bank details without exposing sensitive PII (emails/profiles) to the entire group. 
    - *Solution:* Implemented **data denormalization** by storing necessary bank details directly in the `Membership` document upon joining, protected by granular Firestore Security Rules.
- **Atomic Operations:** Ensuring that joining a group correctly updated both the member list and the group's current count.
    - *Solution:* Utilized **Firestore `writeBatch`** to guarantee that these two operations either both succeed or both fail, preventing data inconsistency.
- **Real-time Synchronization:** Keeping all members' views in sync during rapid contribution cycles.
    - *Solution:* Leveraged **Firestore `onSnapshot`** listeners to provide sub-second updates across all connected clients.

### 6. Screenshots
- `[Screenshot: Dashboard showing active and recruiting groups]`
- `[Screenshot: Group Detail view with the current payout recipient highlighted]`
- `[Screenshot: Contribution submission form with receipt upload]`
- `[Screenshot: User Profile with bank details configuration]`

### 7. Demo
- **Live Demo:** `[Your Vercel Deployment URL]`
- **GitHub Repository:** `[Your GitHub Repository URL]`
