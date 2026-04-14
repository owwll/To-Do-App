import { useState } from 'react';
import { Task } from '@/hooks/useTasks';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Trash2, Pencil, Check, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TaskItemProps {
  task: Task;
  onUpdate: (id: string, updates: Partial<Pick<Task, 'title' | 'description' | 'completed'>>) => void;
  onDelete: (id: string) => void;
}

const TaskItem = ({ task, onUpdate, onDelete }: TaskItemProps) => {
  const [editing, setEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(task.title);
  const [editDesc, setEditDesc] = useState(task.description || '');

  const handleSave = () => {
    if (!editTitle.trim()) return;
    onUpdate(task.id, { title: editTitle.trim(), description: editDesc.trim() || null });
    setEditing(false);
  };

  const handleCancel = () => {
    setEditTitle(task.title);
    setEditDesc(task.description || '');
    setEditing(false);
  };

  const timeAgo = (date: string) => {
    const seconds = Math.floor((Date.now() - new Date(date).getTime()) / 1000);
    if (seconds < 60) return 'just now';
    const mins = Math.floor(seconds / 60);
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    const days = Math.floor(hrs / 24);
    return `${days}d ago`;
  };

  if (editing) {
    return (
      <div className="p-4 rounded-lg border border-primary/30 bg-card shadow-sm animate-scale-in space-y-3">
        <Input
          value={editTitle}
          onChange={(e) => setEditTitle(e.target.value)}
          placeholder="Task title"
          className="font-medium"
          maxLength={200}
          autoFocus
        />
        <Input
          value={editDesc}
          onChange={(e) => setEditDesc(e.target.value)}
          placeholder="Description (optional)"
          maxLength={500}
        />
        <div className="flex gap-2 justify-end">
          <Button size="sm" variant="ghost" onClick={handleCancel} className="gap-1">
            <X className="h-3.5 w-3.5" /> Cancel
          </Button>
          <Button size="sm" onClick={handleSave} className="gap-1">
            <Check className="h-3.5 w-3.5" /> Save
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className={cn(
      "group p-4 rounded-lg border bg-card shadow-sm hover:shadow-md transition-all duration-200 animate-slide-up",
      task.completed && "opacity-60"
    )}>
      <div className="flex items-start gap-3">
        <Checkbox
          checked={task.completed}
          onCheckedChange={(checked) => onUpdate(task.id, { completed: !!checked })}
          className="mt-1 data-[state=checked]:bg-success data-[state=checked]:border-success"
        />
        <div className="flex-1 min-w-0">
          <p className={cn(
            "font-medium text-card-foreground transition-all",
            task.completed && "line-through text-muted-foreground"
          )}>
            {task.title}
          </p>
          {task.description && (
            <p className="text-sm text-muted-foreground mt-1 truncate">
              {task.description}
            </p>
          )}
          <p className="text-xs text-muted-foreground/60 mt-2">
            {timeAgo(task.created_at)}
          </p>
        </div>
        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button
            size="icon"
            variant="ghost"
            className="h-8 w-8 text-muted-foreground hover:text-foreground"
            onClick={() => setEditing(true)}
          >
            <Pencil className="h-3.5 w-3.5" />
          </Button>
          <Button
            size="icon"
            variant="ghost"
            className="h-8 w-8 text-muted-foreground hover:text-destructive"
            onClick={() => onDelete(task.id)}
          >
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TaskItem;
