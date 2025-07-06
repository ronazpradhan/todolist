import { useState } from 'react';
import { useTaskStore } from '../features/tasks/useTaskStore';
import { Filter as FilterIcon, SlidersHorizontal, Trash2 } from 'lucide-react'; // Added Trash2

export function FilterManager() {
  const { labels, filters, addFilter, deleteFilter } = useTaskStore(); // Added deleteFilter
  const [filterName, setFilterName] = useState('');
  const [selectedLabel, setSelectedLabel] = useState<string | undefined>(undefined);

  const handleAddFilter = (e: React.FormEvent) => {
    e.preventDefault();
    if (filterName.trim() && selectedLabel) {
      addFilter(filterName.trim(), { label: selectedLabel });
      setFilterName('');
      setSelectedLabel(undefined);
    }
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
        <SlidersHorizontal size={20} />
        Create a Filter
      </h2>
      <form onSubmit={handleAddFilter} className="flex flex-wrap items-center gap-2 p-4 bg-surface rounded-lg border border-border mb-6">
        <input
          type="text"
          value={filterName}
          onChange={(e) => setFilterName(e.target.value)}
          placeholder="New filter name..."
          className="flex-grow bg-background border border-border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
        />
        <select
          value={selectedLabel || ''}
          onChange={(e) => setSelectedLabel(e.target.value)}
          className="bg-background border border-border rounded-lg px-4 py-2 text-text-secondary focus:outline-none focus:ring-2 focus:ring-primary"
        >
          <option value="" disabled>Select a label</option>
          {labels.map(label => (
            <option key={label} value={label}>{label}</option>
          ))}
        </select>
        <button type="submit" className="px-4 py-2 font-semibold text-white bg-primary rounded-lg hover:bg-primary-hover disabled:opacity-50" disabled={!filterName.trim() || !selectedLabel}>
          Create Filter
        </button>
      </form>

      <h3 className="text-lg font-bold my-4">Saved Filters</h3>
      <div className="space-y-2">
        {filters.length > 0 ? filters.map(filter => (
          <div key={filter.id} className="flex items-center gap-3 p-2 bg-surface rounded-md text-sm group">
            <FilterIcon size={16} className="text-text-secondary" />
            <span className="font-medium flex-grow">{filter.name}</span>
            <span className="text-text-secondary">(Label: {filter.query.label})</span>
            {/* --- ADD THIS BUTTON --- */}
            <button 
              onClick={() => deleteFilter(filter.id)}
              className="text-text-secondary opacity-0 group-hover:opacity-100 hover:text-red-500 transition-opacity"
            >
              <Trash2 size={16} />
            </button>
          </div>
        )) : (
          <p className="text-text-secondary">No filters created yet.</p>
        )}
      </div>
    </div>
  );
}