import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus } from 'lucide-react';

interface AddTaskFormProps {
  onAdd: (title: string, description?: string) => void;
}

const AddTaskForm = ({ onAdd }: AddTaskFormProps) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [expanded, setExpanded] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    onAdd(title.trim(), description.trim() || undefined);
    setTitle('');
    setDescription('');
    setExpanded(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div className="flex gap-2">
        <Input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="What needs to be done?"
          className="flex-1"
          maxLength={200}
          onFocus={() => setExpanded(true)}
        />
        <Button type="submit" size="icon" disabled={!title.trim()}>
          <Plus className="h-4 w-4" />
        </Button>
      </div>
      {expanded && (
        <div className="animate-slide-down">
          <Input
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Add a description (optional)"
            maxLength={500}
          />
        </div>
      )}
    </form>
  );
};

export default AddTaskForm;
