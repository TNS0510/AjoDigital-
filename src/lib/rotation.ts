/**
 * Shuffles an array of UIDs to create a random rotation order.
 * @param uids Array of user UIDs
 * @returns Shuffled array of UIDs
 */
export const shuffleRotationOrder = (uids: string[]): string[] => {
  return [...uids].sort(() => Math.random() - 0.5);
};

/**
 * Calculates the current recipient based on the cycle number and rotation order.
 * @param rotationOrder Array of user UIDs in order
 * @param currentCycle The current cycle index (0-based)
 * @returns The UID of the current recipient
 */
export const getCurrentRecipient = (rotationOrder: string[], currentCycle: number): string | null => {
  if (!rotationOrder || rotationOrder.length === 0) return null;
  return rotationOrder[currentCycle % rotationOrder.length];
};

/**
 * Determines if a group is ready to start (has minimum members).
 * @param currentMemberCount Number of members currently in the group
 * @param maxMembers Maximum allowed members
 * @returns Boolean indicating if the group can start
 */
export const canStartGroup = (currentMemberCount: number, maxMembers: number): boolean => {
  return currentMemberCount >= 2; // Minimum 2 members for a rotation
};
