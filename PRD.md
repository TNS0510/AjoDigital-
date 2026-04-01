# Product Requirements Document (PRD): AjoDigital (Esusu) MVP

## 1. Goal
The primary goal of AjoDigital is to digitize the traditional Nigerian "Ajo" or "Esusu" thrift savings system. By moving this informal practice to a digital platform, we aim to provide transparency, eliminate manual record-keeping errors, and ensure a fair, automated payout rotation for community savings groups.

## 2. Users
*   **Group Organizers**: Trusted individuals who initiate and manage savings groups (e.g., market union leaders, office colleagues).
*   **Group Members**: Individuals who contribute a fixed amount regularly to receive a lump sum payout at a scheduled date (e.g., traders, small business owners, young professionals).

## 3. Problems
*   **Lack of Transparency**: Members often don't know who has paid or when their turn is, leading to distrust.
*   **Manual Errors**: Paper-based records are easily lost or incorrectly updated.
*   **Dispute over Rotations**: Manual assignment of payout dates can lead to accusations of favoritism.
*   **Tracking Difficulties**: Organizers struggle to keep track of multiple members' contributions and payout statuses.

## 4. Features (MVP)
1.  **Group Creation & Onboarding**: Organizers can set the contribution amount (e.g., ₦5,000), frequency (weekly/monthly), and total number of members.
2.  **Automated Payout Rotation**: A fair algorithm that randomly or sequentially assigns payout dates to all members upon group start.
3.  **Contribution Status Dashboard**: A real-time view for all members showing who has paid for the current cycle and who is next for payout.
4.  **Manual Payment Verification**: A simple interface where members upload proof of payment (screenshots) and organizers verify them with a single click.
5.  **Smart Notifications**: Automated SMS or Push reminders sent to members 24 hours before a contribution is due and when a payout is ready.

## 5. User Stories
*   **As an Organizer**, I want to create a group and set the contribution amount so that I can start a savings cycle with my colleagues.
*   **As a Member**, I want to see my assigned payout date immediately after joining so that I can plan for my future expenses.
*   **As a Member**, I want to upload a screenshot of my bank transfer so that the organizer knows I have made my contribution.
*   **As an Organizer**, I want to see a list of pending verifications so that I can quickly update the group's status.
*   **As a Member**, I want to receive a notification when it is my turn to receive the total payout so that I can withdraw the funds.

## 6. Success Metrics
*   **Active Groups**: Number of groups that successfully complete at least one full rotation cycle.
*   **On-Time Contribution Rate**: Percentage of members who upload proof of payment within 24 hours of the due date.
*   **User Retention**: Percentage of members who join a second group after their first cycle ends.
*   **Dispute Reduction**: Qualitative feedback from organizers on the reduction of "who-is-next" arguments.

## 7. Out of Scope
*   **Direct Bank API Integration**: Automated debits from bank accounts (to be added in V2).
*   **Credit Scoring**: Using contribution history to provide loans or credit (to be added in V3).
*   **Micro-insurance**: Bundling savings with health or life insurance products.
*   **Legal Escrow**: Formal legal contracts for high-value groups.
