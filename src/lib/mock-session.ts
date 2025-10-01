// Mock session for testing without authentication
export const mockSession = {
  user: {
    id: 'mock-user-123',
    name: 'Usuario de Prueba',
    email: 'test@example.com',
    image: null,
  },
  expires: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 24 hours from now
};

export function useMockSession() {
  return {
    data: mockSession,
    status: 'authenticated' as const,
  };
}