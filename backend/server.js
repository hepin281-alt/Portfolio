require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('./models/User');
const Task = require('./models/Task');
const auth = require('./middleware/auth');
const { validateRegister, validateLogin, validateTask } = require('./middleware/validate');
const cache = require('./cache');
const { taskEvents, eventLog } = require('./events');

const app = express();
const PORT = process.env.PORT || 5001;
const JWT_SECRET = process.env.JWT_SECRET || 'charusat_itue301_jwt_secret_key_24aiml004';

// ─── Global Middleware ─────────────────────────────────────────
app.use(cors());
app.use(express.json());

// Request Logging Middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// ─── MongoDB Connection ───────────────────────────────────────
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/Taskmanager';
mongoose.connect(MONGODB_URI)
  .then(() => console.log('Connected to MongoDB successfully'))
  .catch(err => console.error('MongoDB connection error:', err));

// ─── Health & Diagnostic Route ────────────────────────────────
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    student: 'Hepinn Bhuva (24AIML004)',
    institution: 'CSPIT-AIML, CHARUSAT',
    cache: cache.getStats ? cache.getStats() : { status: 'active' },
    eventQueue: eventLog.length
  });
});

// ─── Authentication Routes ────────────────────────────────────

// POST /register — Register a new user
app.post('/register', validateRegister, async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ error: 'User with this email already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ email, password: hashedPassword });

    res.status(201).json({
      message: 'User registered successfully',
      user: { id: user._id, email: user.email }
    });
  } catch (err) {
    next(err);
  }
});

// POST /login — Authenticate user and issue JWT
app.post('/login', validateLogin, async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const token = jwt.sign(
      { id: user._id, email: user.email },
      JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.status(200).json({
      message: 'Login successful',
      token,
      user: { id: user._id, email: user.email }
    });
  } catch (err) {
    next(err);
  }
});

// GET /me — Retrieve current user profile
app.get('/me', auth, async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.status(200).json({ user });
  } catch (err) {
    next(err);
  }
});

// ─── Task CRUD Routes with In-Memory Caching (Practical 09) ───

// GET /tasks — Retrieve all tasks (Cached via node-cache, 60s TTL)
app.get('/tasks', auth, async (req, res, next) => {
  const cacheKey = `tasks_${req.user.id}`;
  const bypass = req.query.noCache === 'true';

  try {
    if (!bypass) {
      const cachedTasks = cache.get(cacheKey);
      if (cachedTasks) {
        res.setHeader('X-Cache', 'HIT');
        return res.status(200).json(cachedTasks);
      }
    }

    // Cache MISS: Query MongoDB
    const tasks = await Task.find({ user: req.user.id }).sort({ createdAt: -1 });

    if (!bypass) {
      cache.set(cacheKey, tasks, 60);
      res.setHeader('X-Cache', 'MISS');
    } else {
      res.setHeader('X-Cache', 'BYPASS');
    }

    res.status(200).json(tasks);
  } catch (err) {
    next(err);
  }
});

// POST /tasks — Create task (Invalidates Cache + Emits Async Event)
app.post('/tasks', auth, validateTask, async (req, res, next) => {
  try {
    const { title, priority } = req.body;
    const task = await Task.create({
      title: title.trim(),
      user: req.user.id
    });

    // Invalidate in-memory cache on write
    cache.del(`tasks_${req.user.id}`);

    // Practical 10: Emit asynchronous background event without blocking response
    taskEvents.emit('task-created', {
      title: task.title,
      priority: priority || 'medium',
      user: req.user.email,
      timestamp: new Date().toISOString()
    });

    // Return immediate HTTP 201 Created response
    res.status(201).json(task);
  } catch (err) {
    next(err);
  }
});

// PUT /tasks/:id — Update task (Invalidates Cache)
app.put('/tasks/:id', auth, validateTask, async (req, res, next) => {
  try {
    const { title, completed } = req.body;
    const updateData = {};
    if (title !== undefined) updateData.title = title.trim();
    if (completed !== undefined) updateData.completed = completed;

    const task = await Task.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      updateData,
      { new: true, runValidators: true }
    );

    if (!task) {
      return res.status(404).json({ error: 'Task not found or unauthorized' });
    }

    // Invalidate in-memory cache on write
    cache.del(`tasks_${req.user.id}`);

    res.status(200).json(task);
  } catch (err) {
    next(err);
  }
});

// DELETE /tasks/:id — Delete task (Invalidates Cache + Emits Async Event)
app.delete('/tasks/:id', auth, async (req, res, next) => {
  try {
    const task = await Task.findOneAndDelete({
      _id: req.params.id,
      user: req.user.id
    });

    if (!task) {
      return res.status(404).json({ error: 'Task not found or unauthorized' });
    }

    // Invalidate in-memory cache on write
    cache.del(`tasks_${req.user.id}`);

    // Emit asynchronous background event
    taskEvents.emit('task-deleted', { id: req.params.id });

    res.status(200).json({ message: 'Task deleted successfully', task });
  } catch (err) {
    next(err);
  }
});

// ─── Practical 10: Event Notification Feed ────────────────────
app.get('/notifications', auth, (req, res) => {
  res.status(200).json({
    count: eventLog.length,
    notifications: eventLog
  });
});

// ─── Practical 13: AI Suggestion Route with Graceful Degradation ─
app.post('/api/ai/generate-description', auth, async (req, res) => {
  const { title } = req.body;

  if (!title || !title.trim()) {
    return res.status(400).json({ error: 'Task title is required to generate an AI description.' });
  }

  // Graceful degradation contextual engine
  const titleLower = title.toLowerCase();
  let suggestedDesc = `Execute and verify implementation for "${title.trim()}". Ensure high test coverage and robust error boundaries.`;
  let suggestedPriority = 'medium';

  if (titleLower.includes('docker') || titleLower.includes('compose') || titleLower.includes('nginx')) {
    suggestedDesc = 'Containerize application components and configure orchestration for scalable and reproducible deployment.';
    suggestedPriority = 'high';
  } else if (titleLower.includes('bug') || titleLower.includes('fix') || titleLower.includes('security')) {
    suggestedDesc = 'Investigate root cause, patch vulnerability, and add regression tests to prevent recurrences.';
    suggestedPriority = 'high';
  } else if (titleLower.includes('docs') || titleLower.includes('readme') || titleLower.includes('comment')) {
    suggestedDesc = 'Review and enhance technical documentation, architecture diagrams, and API specifications.';
    suggestedPriority = 'low';
  }

  res.status(200).json({
    success: true,
    source: 'Contextual AI Engine (Graceful Degradation Fallback)',
    fallbackActive: true,
    description: suggestedDesc,
    suggestedPriority,
    disclaimer: 'Generated via fallback engine. Please review and edit before saving.'
  });
});

// ─── 404 Handler for Undefined Routes ─────────────────────────
app.use((req, res) => {
  res.status(404).json({ error: `Cannot ${req.method} ${req.url} - Route not found` });
});

// ─── Global Error Handling Middleware ─────────────────────────
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    error: err.message || 'Something went wrong on the server'
  });
});

// ─── Start Server ─────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
