import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useTasks } from '@/hooks/useTasks';
import TaskItem from '@/components/TaskItem';
import AddTaskForm from '@/components/AddTaskForm';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckSquare, LogOut, ListFilter } from 'lucide-react';

type Filter = 'all' | 'pending' | 'completed';

const Dashboard = () => {
  const { user, signOut } = useAuth();
  const { tasks, loading, addTask, updateTask, deleteTask } = useTasks();
  const [filter, setFilter] = useState<Filter>('all');

  const filteredTasks = tasks.filter((t) => {
    if (filter === 'pending') return !t.completed;
    if (filter === 'completed') return t.completed;
    return true;
  });

  const completedCount = tasks.filter((t) => t.completed).length;
  const pendingCount = tasks.length - completedCount;

  const userName = user?.name || user?.email?.split('@')[0] || 'User';

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckSquare className="h-6 w-6 text-primary" />
            <span className="font-serif font-bold text-lg text-foreground">Taskflow</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm text-muted-foreground hidden sm:block">
              Hi, {userName}
            </span>
            <Button variant="ghost" size="sm" onClick={signOut} className="gap-1.5 text-muted-foreground">
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:inline">Sign out</span>
            </Button>
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="max-w-2xl mx-auto px-4 py-8 space-y-6">
        {/* Welcome */}
        <div className="animate-fade-in">
          <h2 className="text-3xl font-serif font-bold text-foreground">
            Your Tasks
          </h2>
          <p className="text-muted-foreground mt-1">
            {tasks.length === 0
              ? 'Add your first task to get started'
              : `${pendingCount} pending · ${completedCount} completed`}
          </p>
        </div>

        {/* Add task */}
        <div className="animate-slide-up">
          <AddTaskForm onAdd={addTask} />
        </div>

        {/* Filters */}
        {tasks.length > 0 && (
          <div className="flex items-center gap-2 animate-fade-in">
            <ListFilter className="h-4 w-4 text-muted-foreground" />
            {(['all', 'pending', 'completed'] as Filter[]).map((f) => (
              <Button
                key={f}
                variant={filter === f ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setFilter(f)}
                className="capitalize"
              >
                {f}
                {f === 'pending' && pendingCount > 0 && (
                  <Badge variant="secondary" className="ml-1.5 h-5 px-1.5 text-xs">
                    {pendingCount}
                  </Badge>
                )}
                {f === 'completed' && completedCount > 0 && (
                  <Badge variant="secondary" className="ml-1.5 h-5 px-1.5 text-xs">
                    {completedCount}
                  </Badge>
                )}
              </Button>
            ))}
          </div>
        )}

        {/* Task list */}
        <div className="space-y-3">
          {loading ? (
            <div className="text-center py-12 text-muted-foreground">Loading tasks...</div>
          ) : filteredTasks.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground animate-fade-in">
              {filter !== 'all'
                ? `No ${filter} tasks`
                : 'No tasks yet. Create one above!'}
            </div>
          ) : (
            filteredTasks.map((task) => (
              <TaskItem
                key={task.id}
                task={task}
                onUpdate={updateTask}
                onDelete={deleteTask}
              />
            ))
          )}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
