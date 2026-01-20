import { renderHook } from '@testing-library/react';
import { useRole } from '../use-role';
import { UserRole } from '@/lib/auth/roles';
import { useAuthContext } from '@/contexts/auth-context';

// Mock the auth context
jest.mock('@/contexts/auth-context');

describe('useRole', () => {
  const mockUseAuthContext = useAuthContext as jest.MockedFunction<typeof useAuthContext>;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return correct role flags for core team', () => {
    mockUseAuthContext.mockReturnValue({
      user: { id: '1', email: 'admin@example.com' } as any,
      role: UserRole.CORE,
      level: null,
      status: 'approved',
      isLoading: false,
      isInitialized: true,
      login: jest.fn(),
      logout: jest.fn(),
      refreshRole: jest.fn(),
      canPerform: jest.fn(),
    });

    const { result } = renderHook(() => useRole());

    expect(result.current.isCore).toBe(true);
    expect(result.current.isModerator).toBe(false);
    expect(result.current.hasRole).toBe(true);
    expect(result.current.isApproved).toBe(true);
  });

  it('should return correct role flags for moderator', () => {
    mockUseAuthContext.mockReturnValue({
      user: { id: '1', email: 'mod@example.com' } as any,
      role: UserRole.MODERATOR,
      level: 2,
      status: 'approved',
      isLoading: false,
      isInitialized: true,
      login: jest.fn(),
      logout: jest.fn(),
      refreshRole: jest.fn(),
      canPerform: jest.fn(),
    });

    const { result } = renderHook(() => useRole());

    expect(result.current.isCore).toBe(false);
    expect(result.current.isModerator).toBe(true);
    expect(result.current.hasRole).toBe(true);
    expect(result.current.level).toBe(2);
    expect(result.current.isApproved).toBe(true);
  });

  it('should return correct flags for pending user', () => {
    mockUseAuthContext.mockReturnValue({
      user: { id: '1', email: 'pending@example.com' } as any,
      role: UserRole.MODERATOR,
      level: 1,
      status: 'pending',
      isLoading: false,
      isInitialized: true,
      login: jest.fn(),
      logout: jest.fn(),
      refreshRole: jest.fn(),
      canPerform: jest.fn(),
    });

    const { result } = renderHook(() => useRole());

    expect(result.current.isPending).toBe(true);
    expect(result.current.isApproved).toBe(false);
  });
});
