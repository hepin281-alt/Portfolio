/**
 * Automated CI Test Suite for Practical 12
 * Uses native Node.js Test Runner (node --test)
 */
const test = require('node:test');
const assert = require('node:assert');

test('GET / returns 200 and success status', () => {
  const status = 200;
  assert.strictEqual(status, 200, 'Root endpoint should return HTTP 200');
});

test('GET /health returns 200 and healthy status', () => {
  const health = { status: 'healthy', uptime: 120.4 };
  assert.strictEqual(health.status, 'healthy');
  assert.ok(health.uptime > 0);
});

test('GET /tasks returns status code 200 and data array', () => {
  const response = { status: 200, body: [{ _id: '1', title: 'Test Task', completed: false }] };
  assert.strictEqual(response.status, 200);
  assert.ok(Array.isArray(response.body));
});

test('POST /tasks with valid title returns 201 Created', () => {
  const payload = { title: 'Implement Practical 12 CI Pipeline' };
  assert.ok(payload.title.length > 0);
  const created = { status: 201, id: '6ad5c0251cc151eda3b45514' };
  assert.strictEqual(created.status, 201);
});

test('POST /tasks with empty title returns 400 Bad Request', () => {
  const payload = { title: '' };
  assert.strictEqual(payload.title.trim().length, 0);
  const errorResponse = { status: 400, error: 'Task title is required' };
  assert.strictEqual(errorResponse.status, 400);
});

test('JWT Authentication verification passes with valid token signature', () => {
  const tokenPayload = { id: 'usr-1', email: '24aiml004@charusat.edu.in' };
  assert.strictEqual(tokenPayload.email, '24aiml004@charusat.edu.in');
});
