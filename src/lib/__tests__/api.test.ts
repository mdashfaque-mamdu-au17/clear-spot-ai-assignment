import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { api } from '../api';
import MockAdapter from 'axios-mock-adapter';

describe('ApiClient', () => {
  let mock: MockAdapter;

  beforeEach(() => {
    mock = new MockAdapter((api as any).instance);
  });

  afterEach(() => {
    mock.reset();
  });

  it('should include the auth token in headers when set', async () => {
    const token = 'test-token';
    api.setToken(token);

    mock.onGet('/test').reply(200, { success: true });

    await api.get('/test');

    expect(mock.history.get[0].headers?.Authorization).toBe(`Bearer ${token}`);
  });

  it('should handle successful GET requests', async () => {
    const data = { id: 1, name: 'Test' };
    mock.onGet('/data').reply(200, data);

    const result = await api.get('/data');
    expect(result).toEqual(data);
  });

  it('should handle POST requests with data', async () => {
    const postData = { name: 'New Site' };
    mock.onPost('/sites', postData).reply(201, { id: '123', ...postData });

    const result = await api.post('/sites', postData);
    expect(result).toEqual({ id: '123', ...postData });
  });

  it('should handle 401 errors and log them', async () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    mock.onGet('/unauthorized').reply(401);

    await expect(api.get('/unauthorized')).rejects.toThrow();
    expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('Unauthorized request'), expect.any(String));
    
    consoleSpy.mockRestore();
  });
});
