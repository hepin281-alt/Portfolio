import React, { useState } from 'react';

function TaskItem({ task, onUpdate, onDelete }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(task.title);
  const [loading, setLoading] = useState(false);

  const handleToggle = async () => {
    setLoading(true);
    try {
      await onUpdate(task._id, { completed: !task.completed });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!editTitle.trim()) return;
    setLoading(true);
    try {
      await onUpdate(task._id, { title: editTitle.trim() });
      setIsEditing(false);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleSave();
    if (e.key === 'Escape') { setIsEditing(false); setEditTitle(task.title); }
  };

  return (
    <li className={`task-item ${task.completed ? 'completed' : ''} ${loading ? 'loading' : ''}`}>
      <input
        type="checkbox"
        checked={task.completed}
        onChange={handleToggle}
        disabled={loading}
        className="task-checkbox"
      />
      {isEditing ? (
        <input
          type="text"
          className="edit-input"
          value={editTitle}
          onChange={(e) => setEditTitle(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={handleSave}
          autoFocus
        />
      ) : (
        <span className="task-title" onDoubleClick={() => setIsEditing(true)}>
          {task.title}
        </span>
      )}
      <div className="task-actions">
        <button className="btn btn-edit" onClick={() => setIsEditing(true)} disabled={loading}>Edit</button>
        <button className="btn btn-danger" onClick={() => onDelete(task._id)} disabled={loading}>Delete</button>
      </div>
    </li>
  );
}

export default TaskItem;
