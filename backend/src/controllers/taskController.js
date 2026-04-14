import mongoose from 'mongoose';
import { Task } from '../models/Task.js';

const toTaskDto = (task) => ({
  id: task._id.toString(),
  title: task.title,
  description: task.description,
  completed: task.completed,
  created_at: task.createdAt.toISOString(),
  updated_at: task.updatedAt.toISOString(),
});

export const addTask = async (req, res) => {
  try {
    const { title, description } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({ message: 'Title is required' });
    }

    const task = await Task.create({
      userId: req.userId,
      title: title.trim(),
      description: description?.trim() || null,
    });

    return res.status(201).json({ task: toTaskDto(task) });
  } catch {
    return res.status(500).json({ message: 'Failed to create task' });
  }
};

export const getTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ userId: req.userId }).sort({ createdAt: -1 });
    return res.status(200).json({ tasks: tasks.map(toTaskDto) });
  } catch {
    return res.status(500).json({ message: 'Failed to fetch tasks' });
  }
};

export const updateTask = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, completed } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid task id' });
    }

    const updates = {};
    if (typeof title === 'string') {
      if (!title.trim()) {
        return res.status(400).json({ message: 'Title cannot be empty' });
      }
      updates.title = title.trim();
    }

    if (typeof description !== 'undefined') {
      updates.description = typeof description === 'string' ? description.trim() || null : null;
    }

    if (typeof completed === 'boolean') {
      updates.completed = completed;
    }

    const task = await Task.findOneAndUpdate(
      { _id: id, userId: req.userId },
      updates,
      { new: true }
    );

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    return res.status(200).json({ task: toTaskDto(task) });
  } catch {
    return res.status(500).json({ message: 'Failed to update task' });
  }
};

export const deleteTask = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid task id' });
    }

    const deleted = await Task.findOneAndDelete({ _id: id, userId: req.userId });
    if (!deleted) {
      return res.status(404).json({ message: 'Task not found' });
    }

    return res.status(200).json({ message: 'Task deleted' });
  } catch {
    return res.status(500).json({ message: 'Failed to delete task' });
  }
};
