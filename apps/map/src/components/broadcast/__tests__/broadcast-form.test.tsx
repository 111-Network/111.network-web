import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BroadcastForm } from '../broadcast-form';

// Mock hooks
jest.mock('@/hooks/use-broadcast', () => ({
  useBroadcast: () => ({
    postBroadcast: jest.fn().mockResolvedValue({ success: true, data: { id: '123' } }),
    isLoading: false,
    error: null,
    remaining: 19,
  }),
}));

jest.mock('@/hooks/use-device-id', () => ({
  useDeviceId: () => ({
    deviceIdHash: 'test-device-hash',
    isLoading: false,
  }),
}));

describe('BroadcastForm', () => {
  const mockOnSuccess = jest.fn();
  const mockOnLocationChange = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render form fields', () => {
    render(
      <BroadcastForm
        onSuccess={mockOnSuccess}
        onLocationChange={mockOnLocationChange}
      />
    );

    expect(screen.getByLabelText(/message/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/latitude/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/longitude/i)).toBeInTheDocument();
    expect(screen.getByText(/broadcast now/i)).toBeInTheDocument();
  });

  it('should enforce character limit', () => {
    render(<BroadcastForm />);

    const textarea = screen.getByLabelText(/message/i);
    const longText = 'a'.repeat(241);

    fireEvent.change(textarea, { target: { value: longText } });

    // Should only allow 240 characters
    expect(textarea).toHaveValue('a'.repeat(240));
  });

  it('should show character counter', () => {
    render(<BroadcastForm />);

    const textarea = screen.getByLabelText(/message/i);
    fireEvent.change(textarea, { target: { value: 'Test message' } });

    expect(screen.getByText(/characters remaining/i)).toBeInTheDocument();
  });

  it('should validate required fields', async () => {
    render(<BroadcastForm onSuccess={mockOnSuccess} />);

    const submitButton = screen.getByText(/broadcast now/i);
    fireEvent.click(submitButton);

    // Form should not submit without content
    await waitFor(() => {
      expect(mockOnSuccess).not.toHaveBeenCalled();
    });
  });

  it('should default to region precision', () => {
    render(<BroadcastForm />);

    const regionButton = screen.getByText(/region/i);
    expect(regionButton).toHaveClass('bg-primary');
  });
});
