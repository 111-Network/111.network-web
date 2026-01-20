import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '../types/database';

/**
 * User role types
 */
export enum UserRole {
  CORE = 'core',
  MODERATOR = 'moderator',
  NONE = 'none', // String value for enum, but treated as null in logic
}

/**
 * Type guard to check if role is NONE (treated as null/no role)
 */
export function isNoRole(role: UserRole): boolean {
  return role === UserRole.NONE;
}

/**
 * Role information returned from database
 */
export interface RoleInfo {
  role: UserRole;
  level: number | null;
  isCore: boolean;
  status: string | null;
}

/**
 * Get user's role from the database.
 * 
 * Uses the get_user_role() database function to efficiently check
 * both core_team and community_contributors tables.
 * 
 * @param supabase - Supabase client (should be service role for security)
 * @param userId - User ID to check
 * @returns Role information or null if user has no role
 */
export async function getUserRole(
  supabase: SupabaseClient<Database>,
  userId: string
): Promise<RoleInfo | null> {
  const { data, error } = await supabase.rpc('get_user_role', {
    p_user_id: userId,
  });

  if (error) {
    console.error('Error getting user role:', error);
    return null;
  }

  if (!data || data.length === 0) {
    return null;
  }

  const result = data[0];
  
  // Handle null role_type (user has no role)
  if (!result.role_type) {
    return {
      role: UserRole.NONE,
      level: null,
      isCore: false,
      status: null,
    };
  }

  // Map database role_type to UserRole enum
  let role: UserRole;
  if (result.role_type === 'core') {
    role = UserRole.CORE;
  } else if (result.role_type === 'moderator') {
    role = UserRole.MODERATOR;
  } else {
    return {
      role: UserRole.NONE,
      level: null,
      isCore: false,
      status: null,
    };
  }

  return {
    role,
    level: result.level ?? null,
    isCore: result.is_core ?? false,
    status: result.status ?? null,
  };
}

/**
 * Check if a role can perform a specific action.
 * 
 * This is a placeholder for future permission-based access control.
 * For now, CORE can do everything, MODERATOR has limited access.
 * 
 * @param role - User's role
 * @param action - Action to check (e.g., 'delete_message', 'approve_user')
 * @returns Whether the role can perform the action
 */
export function canPerformAction(role: UserRole, action: string): boolean {
  // Core team can do everything
  if (role === UserRole.CORE) {
    return true;
  }

  // Moderators have limited permissions
  if (role === UserRole.MODERATOR) {
    // Define allowed actions for moderators
    const moderatorActions = [
      'approve_messages',
      'flag_content',
      'hide_messages',
      'view_moderation_queue',
    ];
    return moderatorActions.includes(action);
  }

  // No role = no permissions
  return false;
}

/**
 * Check if a role meets the required role level.
 * 
 * @param userRole - User's current role
 * @param requiredRole - Required role level
 * @returns Whether the user role meets the requirement
 */
export function requireRole(userRole: UserRole, requiredRole: UserRole): boolean {
  // Core always satisfies any requirement
  if (userRole === UserRole.CORE) {
    return true;
  }

  // Exact match required for other roles
  return userRole === requiredRole;
}

/**
 * Check if a moderator level can perform an action.
 * 
 * Future: Implement level-based permissions (1-5)
 * 
 * @param level - Moderator level (1-5)
 * @param action - Action to check
 * @returns Whether the level can perform the action
 */
export function canModeratorLevelPerform(level: number | null, action: string): boolean {
  if (level === null) {
    return false;
  }

  // Future: Implement level-based permissions
  // For now, all moderator levels have the same permissions
  return canPerformAction(UserRole.MODERATOR, action);
}
