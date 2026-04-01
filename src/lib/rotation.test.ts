import { describe, it, expect } from 'vitest';
import { shuffleRotationOrder, getCurrentRecipient, canStartGroup } from './rotation';

describe('Rotation Logic Utilities', () => {
  describe('shuffleRotationOrder', () => {
    it('should return an array of the same length', () => {
      const uids = ['user1', 'user2', 'user3'];
      const shuffled = shuffleRotationOrder(uids);
      expect(shuffled).toHaveLength(uids.length);
    });

    it('should contain all the original UIDs', () => {
      const uids = ['user1', 'user2', 'user3'];
      const shuffled = shuffleRotationOrder(uids);
      expect(shuffled).toEqual(expect.arrayContaining(uids));
    });
  });

  describe('getCurrentRecipient', () => {
    it('should return the correct recipient for the cycle', () => {
      const rotationOrder = ['user1', 'user2', 'user3'];
      expect(getCurrentRecipient(rotationOrder, 0)).toBe('user1');
      expect(getCurrentRecipient(rotationOrder, 1)).toBe('user2');
      expect(getCurrentRecipient(rotationOrder, 2)).toBe('user3');
    });

    it('should handle cycle numbers larger than the rotation order length', () => {
      const rotationOrder = ['user1', 'user2', 'user3'];
      expect(getCurrentRecipient(rotationOrder, 3)).toBe('user1');
      expect(getCurrentRecipient(rotationOrder, 4)).toBe('user2');
    });

    it('should return null for empty rotation order', () => {
      expect(getCurrentRecipient([], 0)).toBeNull();
    });
  });

  describe('canStartGroup', () => {
    it('should return true if there are 2 or more members', () => {
      expect(canStartGroup(2, 10)).toBe(true);
      expect(canStartGroup(5, 10)).toBe(true);
    });

    it('should return false if there is only 1 member', () => {
      expect(canStartGroup(1, 10)).toBe(false);
    });
  });
});
