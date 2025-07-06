import { Circle, CheckCircle2, Trash2, Calendar, MoreHorizontal } from 'lucide-react';
import { motion } from 'framer-motion';

export type Task = {
  id: string;
  text: string;
  completed: boolean;
  dueDate: string | null;
  priority: 'p1' | 'p2' | 'p3' | 'p4'; 
  projectId: string; 
  labels?: string[];
  // Supabase specific fields
  user_id?: string;
  created_at?: string;
};

const priorityColors = {
  p1: 'text-red-500',
  p2: 'text-orange-500',
  p3: 'text-blue-500',
  p4: 'text-gray-400',
};

type TaskItemProps = {
  task: Task;
  onToggleComplete: (id: string, currentStatus: boolean) => void;
  onDelete: (id: string) => void;
  onEdit: (task: Task) => void; 
};

export function TaskItem({ task, onToggleComplete, onDelete, onEdit }: TaskItemProps) {
  const isDueToday = task.dueDate === new Date().toISOString().split('T')[0];
  const isOverdue = task.dueDate && !task.completed ? new Date(task.dueDate).setHours(0,0,0,0) < new Date().setHours(0,0,0,0) : false;

  const dueDateStyle = isOverdue ? 'text-red-500' : isDueToday ? 'text-green-500' : 'text-text-secondary';

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -20, transition: { duration: 0.2 } }}
      transition={{ duration: 0.3, type: 'spring' }}
      className="flex items-start p-3 bg-surface rounded-lg group border border-transparent hover:border-border transition-colors"
    >
      <button 
        onClick={() => onToggleComplete(task.id, task.completed)} 
        className={`flex-shrink-0 mt-1 text-primary hover:text-primary-hover ${task.completed ? '' : priorityColors[task.priority]}`}
      >
        {task.completed ? <CheckCircle2 /> : <Circle />}
      </button>

      <div className="flex-grow mx-4">
        <p className={` ${task.completed ? 'line-through text-text-secondary' : 'text-text-primary'}`}>
          {task.text}
        </p>
        
        <div className="flex items-center gap-4 pt-1">
          {task.dueDate && (
            <div className={`flex items-center gap-2 text-sm ${dueDateStyle}`}>
              <Calendar size={14} />
              <span>{new Date(task.dueDate).toLocaleDateString('en-US', { timeZone: 'UTC', month: 'short', day: 'numeric' })}</span>
            </div>
          )}
          
          {task.labels && task.labels.map(label => (
            <div key={label} className="text-xs text-text-secondary bg-background px-2 py-0.5 rounded-md">
              {label}
            </div>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <button onClick={() => onEdit(task)} className="text-text-secondary hover:text-text-primary">
          <MoreHorizontal size={18} />
        </button>
        <button onClick={() => onDelete(task.id)} className="text-text-secondary hover:text-red-500">
          <Trash2 size={18} />
        </button>
      </div>
    </motion.div>
  );
}