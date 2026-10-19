const EventEmitter = require('events');

/**
 * Event-Driven Background Processing System (Practical 10)
 * Uses Node.js native EventEmitter for non-blocking asynchronous notifications.
 */
class TaskNotificationEmitter extends EventEmitter {}
const taskEvents = new TaskNotificationEmitter();

// In-memory event audit log
const eventLog = [
  {
    id: 'evt-init',
    type: 'system-ready',
    taskTitle: 'EventEmitter lifecycle initialized',
    priority: 'normal',
    user: '24aiml004@charusat.edu.in',
    receivedAt: new Date(Date.now() - 60000).toISOString(),
    completedAt: new Date(Date.now() - 59800).toISOString(),
    durationMs: 200,
    status: 'success'
  }
];

// Asynchronous non-blocking listener for task creation
taskEvents.on('task-created', (data) => {
  const receivedAt = data.timestamp || new Date().toISOString();
  const startTime = Date.now();

  // Perform background notification asynchronously without blocking HTTP response
  setTimeout(() => {
    const finishedAt = new Date().toISOString();
    const duration = Date.now() - startTime;
    const entry = {
      id: `evt-${Date.now()}`,
      type: 'task-created',
      taskTitle: data.title,
      priority: data.priority || 'medium',
      user: data.user || '24aiml004@charusat.edu.in',
      receivedAt,
      completedAt: finishedAt,
      durationMs: duration,
      status: 'success'
    };
    eventLog.unshift(entry);
    if (eventLog.length > 50) eventLog.pop();
    console.log(`[EventEmitter] Background notification sent for: "${data.title}" (+${duration}ms)`);
  }, 1500);
});

// Asynchronous listener for task deletion
taskEvents.on('task-deleted', (data) => {
  setTimeout(() => {
    eventLog.unshift({
      id: `evt-${Date.now()}`,
      type: 'task-deleted',
      taskId: data.id,
      timestamp: new Date().toISOString(),
      status: 'success'
    });
  }, 300);
});

taskEvents.on('error', (err) => {
  console.error('[EventEmitter Error Handler]:', err.message);
});

module.exports = { taskEvents, eventLog };
