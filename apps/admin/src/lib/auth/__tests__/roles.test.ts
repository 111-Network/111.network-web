import { UserRole, canPerformAction, requireRole } from '../roles';

describe('Role utilities', () => {
  describe('canPerformAction', () => {
    it('should allow core team to perform any action', () => {
      expect(canPerformAction(UserRole.CORE, 'delete_message')).toBe(true);
      expect(canPerformAction(UserRole.CORE, 'approve_user')).toBe(true);
      expect(canPerformAction(UserRole.CORE, 'any_action')).toBe(true);
    });

    it('should allow moderators to perform moderator actions', () => {
      expect(canPerformAction(UserRole.MODERATOR, 'approve_messages')).toBe(true);
      expect(canPerformAction(UserRole.MODERATOR, 'flag_content')).toBe(true);
      expect(canPerformAction(UserRole.MODERATOR, 'hide_messages')).toBe(true);
      expect(canPerformAction(UserRole.MODERATOR, 'view_moderation_queue')).toBe(true);
    });

    it('should deny moderators from performing core-only actions', () => {
      expect(canPerformAction(UserRole.MODERATOR, 'delete_message')).toBe(false);
      expect(canPerformAction(UserRole.MODERATOR, 'approve_user')).toBe(false);
    });

    it('should deny users with no role from performing any action', () => {
      expect(canPerformAction(UserRole.NONE, 'approve_messages')).toBe(false);
      expect(canPerformAction(UserRole.NONE, 'any_action')).toBe(false);
    });
  });

  describe('requireRole', () => {
    it('should allow core team to satisfy any role requirement', () => {
      expect(requireRole(UserRole.CORE, UserRole.CORE)).toBe(true);
      expect(requireRole(UserRole.CORE, UserRole.MODERATOR)).toBe(true);
    });

    it('should require exact match for moderator role', () => {
      expect(requireRole(UserRole.MODERATOR, UserRole.MODERATOR)).toBe(true);
      expect(requireRole(UserRole.MODERATOR, UserRole.CORE)).toBe(false);
    });

    it('should deny users with no role', () => {
      expect(requireRole(UserRole.NONE, UserRole.MODERATOR)).toBe(false);
      expect(requireRole(UserRole.NONE, UserRole.CORE)).toBe(false);
    });
  });
});
