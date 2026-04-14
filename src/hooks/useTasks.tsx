import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { useToast } from '@/hooks/use-toast';

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
  const { user } = useAuth();
  const { toast } = useToast();

  const fetchTasks = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      toast({ title: 'Error fetching tasks', description: error.message, variant: 'destructive' });
    } else {
      setTasks(data || []);
    }
    setLoading(false);
  }, [user, toast]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const addTask = async (title: string, description?: string) => {
    if (!user) return;
    const { error } = await supabase
      .from('tasks')
      .insert({ title, description: description || null, user_id: user.id });

    if (error) {
      toast({ title: 'Error adding task', description: error.message, variant: 'destructive' });
    } else {
      toast({ title: 'Task added!' });
      fetchTasks();
    }
  };

  const updateTask = async (id: string, updates: Partial<Pick<Task, 'title' | 'description' | 'completed'>>) => {
    const { error } = await supabase
      .from('tasks')
      .update(updates)
      .eq('id', id);

    if (error) {
      toast({ title: 'Error updating task', description: error.message, variant: 'destructive' });
    } else {
      fetchTasks();
    }
  };

  const deleteTask = async (id: string) => {
    const { error } = await supabase
      .from('tasks')
      .delete()
      .eq('id', id);

    if (error) {
      toast({ title: 'Error deleting task', description: error.message, variant: 'destructive' });
    } else {
      toast({ title: 'Task deleted' });
      fetchTasks();
    }
  };

  return { tasks, loading, addTask, updateTask, deleteTask, fetchTasks };
};
