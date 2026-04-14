import { useState, useEffect, useCallback } from 'react';
import { useAuth } from './useAuth';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/api';

export interface Task {
  id: string;
  title: string;
  description: string | null;
  completed: boolean;
  created_at: string;
  updated_at: string;
}

export const useTasks = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const { user, token } = useAuth();
  const { toast } = useToast();

  const getErrorMessage = (error: unknown) =>
    error instanceof Error ? error.message : 'Unexpected error';

  const fetchTasks = useCallback(async () => {
    if (!user || !token) {
      setTasks([]);
      setLoading(false);
      return;
    }

    setLoading(true);

    try {
      const response = await apiRequest<{ tasks: Task[] }>('/tasks', { token });
      setTasks(response.tasks || []);
    } catch (error) {
      toast({ title: 'Error fetching tasks', description: getErrorMessage(error), variant: 'destructive' });
      setTasks([]);
    } finally {
      setLoading(false);
    }
  }, [user, token, toast]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const addTask = async (title: string, description?: string) => {
    if (!user || !token) return;

    try {
      await apiRequest('/tasks', {
        method: 'POST',
        body: { title, description: description || null },
        token,
      });
      toast({ title: 'Task added!' });
      await fetchTasks();
    } catch (error) {
      toast({ title: 'Error adding task', description: getErrorMessage(error), variant: 'destructive' });
    }
  };

  const updateTask = async (id: string, updates: Partial<Pick<Task, 'title' | 'description' | 'completed'>>) => {
    if (!token) return;

    try {
      await apiRequest(`/tasks/${id}`, {
        method: 'PATCH',
        body: updates,
        token,
      });
      await fetchTasks();
    } catch (error) {
      toast({ title: 'Error updating task', description: getErrorMessage(error), variant: 'destructive' });
    }
  };

  const deleteTask = async (id: string) => {
    if (!token) return;

    try {
      await apiRequest(`/tasks/${id}`, {
        method: 'DELETE',
        token,
      });
      toast({ title: 'Task deleted' });
      await fetchTasks();
    } catch (error) {
      toast({ title: 'Error deleting task', description: getErrorMessage(error), variant: 'destructive' });
    }
  };

  return { tasks, loading, addTask, updateTask, deleteTask, fetchTasks };
};
