import { useState, useEffect } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { motion, AnimatePresence } from 'framer-motion';
import { useTaskStore } from '../features/tasks/useTaskStore';
import { X, Tag } from 'lucide-react';

export function EditTaskModal() {
  const { editingTask, setEditingTask, editTask, labels: allLabels } = useTaskStore();

  // Local state for the form inputs
  const [text, setText] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [taskLabels, setTaskLabels] = useState<string[]>([]); // State for this task's labels

  useEffect(() => {
    if (editingTask) {
      setText(editingTask.text);
      setDueDate(editingTask.dueDate || '');
      setTaskLabels(editingTask.labels || []); // Populate labels when modal opens
    }
  }, [editingTask]);

  const handleToggleLabel = (label: string) => {
    setTaskLabels(prev => 
      prev.includes(label) ? prev.filter(l => l !== label) : [...prev, label]
    );
  };

  const handleSave = () => {
    if (editingTask && text.trim()) {
      editTask(editingTask.id, text.trim(), dueDate || null, taskLabels); // Pass labels on save
    }
  };

  const isOpen = !!editingTask;

  return (
    <Dialog.Root open={isOpen} onOpenChange={() => setEditingTask(null)}>
      <AnimatePresence>
        {isOpen && (
          <Dialog.Portal forceMount>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <Dialog.Overlay className="fixed inset-0 bg-black/50" />
            </motion.div>
            
            <Dialog.Content asChild>
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90vw] max-w-lg bg-surface rounded-lg p-6 shadow-lg"
              >
                <Dialog.Title className="text-xl font-bold mb-4">Edit Task</Dialog.Title>
                
                <div className="space-y-4">
                  <input
                    type="text"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    className="w-full bg-background border border-border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                  <input
                    type="date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className="w-full bg-background border border-border rounded-lg px-4 py-2 text-text-secondary focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                {/* --- Label Selector --- */}
                <div className="mt-4">
                  <h3 className="text-sm font-medium text-text-secondary mb-2">Labels</h3>
                  <div className="flex flex-wrap gap-2">
                    {allLabels.map(label => {
                      const isSelected = taskLabels.includes(label);
                      return (
                        <button
                          key={label}
                          onClick={() => handleToggleLabel(label)}
                          className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium border transition-colors ${
                            isSelected 
                            ? 'bg-primary/20 border-primary text-primary' 
                            : 'bg-surface border-border hover:border-gray-600'
                          }`}
                        >
                          <Tag size={14} />
                          <span>{label.substring(1)}</span>
                        </button>
                      )
                    })}
                  </div>
                </div>

                <div className="flex justify-end gap-4 mt-6">
                  <Dialog.Close asChild>
                    <button className="px-4 py-2 font-semibold text-text-secondary rounded-lg hover:bg-background">
                      Cancel
                    </button>
                  </Dialog.Close>
                  <button
                    onClick={handleSave}
                    className="px-4 py-2 font-semibold text-white bg-primary rounded-lg hover:bg-primary-hover"
                  >
                    Save Changes
                  </button>
                </div>
                
                <Dialog.Close asChild>
                   <button className="absolute top-4 right-4 text-text-secondary hover:text-text-primary" aria-label="Close">
                     <X size={20} />
                   </button>
                </Dialog.Close>
              </motion.div>
            </Dialog.Content>
          </Dialog.Portal>
        )}
      </AnimatePresence>
    </Dialog.Root>
  );
}