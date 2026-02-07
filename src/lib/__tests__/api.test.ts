import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { api } from '../api';
import MockAdapter from 'axios-mock-adapter';

describe('ApiClient', () => {
  let mock: MockAdapter;

  beforeEach(() => {
    // Access the private instance for testing purposes
    // @ts-ignore - accessing private field for testing
    mock = new MockAdapter(api.instance);
  });

  afterEach(() => {
    mock.reset();
    vi.restoreAllMocks();
  });

  it('should include the auth token in headers when set', async () => {
    const token = 'test-token';
    api.setToken(token);

    mock.onGet('/test').reply(200, { success: true });

    await api.get('/test');

    expect(mock.history.get[0].headers?.Authorization).toBe(`Bearer ${token}`);
  });

  it('should handle successful GET requests', async () => {
    const data = { id: '1', name: 'Test Site' };
    mock.onGet('/sites/1').reply(200, data);

    const result = await api.get('/sites/1');
    expect(result).toEqual(data);
  });

  it('should dispatch api-error event on 401 Unauthorized', async () => {
    const dispatchSpy = vi.spyOn(window, 'dispatchEvent');
    mock.onGet('/protected').reply(401);

    try {
      await api.get('/protected');
    } catch (e) {
    }

    expect(dispatchSpy).toHaveBeenCalled();
    const event = dispatchSpy.mock.calls[0][0] as CustomEvent;
    expect(event.type).toBe('api-error');
    expect(event.detail.message).toContain('Session expired');
  });

  it('should dispatch api-error event on 500 Server Error', async () => {
    const dispatchSpy = vi.spyOn(window, 'dispatchEvent');
    mock.onGet('/error').reply(500);

    try {
      await api.get('/error');
    } catch (e) {
    }

    expect(dispatchSpy).toHaveBeenCalled();
    const event = dispatchSpy.mock.calls[0][0] as CustomEvent;
    expect(event.type).toBe('api-error');
    expect(event.detail.message).toContain('Server error');
  });

  it('should handle POST requests', async () => {
    const postData = { name: 'New Site' };
    mock.onPost('/sites').reply(201, { id: '123', ...postData });

    const result = await api.post('/sites', postData);
    expect(result).toEqual({ id: '123', ...postData });
  });

  it('should handle PUT requests', async () => {
    const updateData = { name: 'Updated Site' };
    mock.onPut('/sites/1').reply(200, { id: '1', ...updateData });

    const result = await api.put('/sites/1', updateData);
    expect(result).toEqual({ id: '1', ...updateData });
  });

  it('should handle DELETE requests', async () => {
    mock.onDelete('/sites/1').reply(204);

    const result = await api.delete('/sites/1');
    expect(result).toBeUndefined();
  });
});
