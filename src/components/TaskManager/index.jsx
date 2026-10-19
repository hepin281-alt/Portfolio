import React, { useState, useEffect, useCallback } from 'react';
import {
  getToken,
  removeToken,
  loginUser,
  registerUser,
  getProfile,
  getTasks,
  createTask,
  updateTask,
  deleteTask
} from './api';
import AuthForm from './AuthForm';
import TaskForm from './TaskForm';
import TaskItem from './TaskItem';
import Toast from './Toast';
import ConfirmDialog from './ConfirmDialog';
import './TaskManager.css';

function TaskManager() {
  const [currentUser, setCurrentUser] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [authLoading, setAuthLoading] = useState(false);
  const [error, setError] = useState(null);
  const [toast, setToast] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
  };

  // Check authentication status on mount
  const checkAuth = useCallback(async () => {
    const token = getToken();
    if (!token) {
      setCurrentUser(null);
      return;
    }
    try {
      const data = await getProfile();
      setCurrentUser(data.user);
    } catch {
      removeToken();
      setCurrentUser(null);
    }
  }, []);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  // Handle unauthorized event dispatched by API
  useEffect(() => {
    const handleUnauthorized = () => {
      setCurrentUser(null);
      setTasks([]);
      showToast('Session expired. Please log in again.', 'error');
    };
    window.addEventListener('auth:unauthorized', handleUnauthorized);
    return () => window.removeEventListener('auth:unauthorized', handleUnauthorized);
  }, []);

  // Fetch tasks for logged-in user
  const fetchTasks = useCallback(async () => {
    if (!currentUser) return;
    setLoading(true);
    setError(null);
    try {
      const data = await getTasks();
      setTasks(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [currentUser]);

  useEffect(() => {
    if (currentUser) {
      fetchTasks();
    }
  }, [currentUser, fetchTasks]);

  // Auth Handlers
  const handleLogin = async (email, password) => {
    setAuthLoading(true);
    try {
      const data = await loginUser(email, password);
      setCurrentUser(data.user);
      showToast('Login successful!');
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setAuthLoading(false);
    }
  };

  const handleRegister = async (email, password) => {
    setAuthLoading(true);
    try {
      await registerUser(email, password);
      // Auto login upon successful registration
      const data = await loginUser(email, password);
      setCurrentUser(data.user);
      showToast('Registration successful! Welcome aboard.');
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setAuthLoading(false);
    }
  };

  const handleLogout = () => {
    removeToken();
    setCurrentUser(null);
    setTasks([]);
    showToast('Logged out successfully.');
  };

  // Task Actions
  const handleAdd = async (title) => {
    try {
      const newTask = await createTask(title);
      setTasks(prev => [newTask, ...prev]);
      showToast('Task created successfully!');
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  const handleUpdate = async (id, data) => {
    try {
      const updated = await updateTask(id, data);
      setTasks(prev => prev.map(t => t._id === id ? updated : t));
      showToast('Task updated successfully!');
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  const handleDeleteRequest = (id) => {
    setConfirmDelete(id);
  };

  const handleDeleteConfirm = async () => {
    const id = confirmDelete;
    setConfirmDelete(null);
    try {
      await deleteTask(id);
      setTasks(prev => prev.filter(t => t._id !== id));
      showToast('Task deleted successfully!');
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  return (
    <div className="task-manager-app">
      <header className="app-header">
        <h1>Task Manager</h1>
        <p>Full-Stack React + Express + MongoDB with JWT Authentication</p>
      </header>

      {!currentUser ? (
        <AuthForm
          onLogin={handleLogin}
          onRegister={handleRegister}
          loading={authLoading}
        />
      ) : (
        <main className="app-main">
          <div className="user-profile-bar">
            <div className="user-info">
              <span className="user-badge">Logged in</span>
              <span className="user-email">{currentUser.email}</span>
            </div>
            <button className="btn btn-logout" onClick={handleLogout}>
              Logout
            </button>
          </div>

          <TaskForm onAdd={handleAdd} />

          {loading && <div className="status-msg">Loading tasks...</div>}
          {error && (
            <div className="status-msg error">
              {error} <button onClick={fetchTasks}>Retry</button>
            </div>
          )}

          {!loading && !error && tasks.length === 0 && (
            <div className="status-msg">No tasks yet. Add one above!</div>
          )}

          <ul className="task-list">
            {tasks.map(task => (
              <TaskItem
                key={task._id}
                task={task}
                onUpdate={handleUpdate}
                onDelete={handleDeleteRequest}
              />
            ))}
          </ul>
        </main>
      )}

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      {confirmDelete && (
        <ConfirmDialog
          message="Are you sure you want to delete this task?"
          onConfirm={handleDeleteConfirm}
          onCancel={() => setConfirmDelete(null)}
        />
      )}
    </div>
  );
}

export default TaskManager;
