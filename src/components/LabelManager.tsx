import { useState } from 'react';
import { useTaskStore } from '../features/tasks/useTaskStore';
import { Tag, X } from 'lucide-react';

export function LabelManager() {
  const { labels, addLabel, deleteLabel } = useTaskStore();
  const [newLabel, setNewLabel] = useState('');

  const handleAddLabel = (e: React.FormEvent) => {
    e.preventDefault();
    if (newLabel.trim()) {
      addLabel(newLabel.trim());
      setNewLabel('');
    }
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Labels</h2>
      <form onSubmit={handleAddLabel} className="flex gap-2 mb-6">
        <input
          type="text"
          value={newLabel}
          onChange={(e) => setNewLabel(e.target.value)}
          placeholder="Create a new label..."
          className="flex-grow bg-background border border-border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
        />
        <button type="submit" className="px-4 py-2 font-semibold text-white bg-primary rounded-lg hover:bg-primary-hover disabled:opacity-50" disabled={!newLabel.trim()}>
          Add Label
        </button>
      </form>

      <div className="flex flex-wrap gap-3">
        {labels.length > 0 ? labels.map(label => (
          <div key={label} className="flex items-center gap-2 bg-surface pl-3 pr-2 py-1 rounded-full text-sm font-medium group">
            <Tag size={14} className="text-text-secondary" />
            <span>{label.substring(1)}</span>
            <button 
              onClick={() => deleteLabel(label)}
              className="text-text-secondary opacity-0 group-hover:opacity-100 hover:text-red-500 transition-opacity"
            >
              <X size={14} />
            </button>
          </div>
        )) : (
          <p className="text-text-secondary">No labels created yet.</p>
        )}
      </div>
    </div>
  );
}