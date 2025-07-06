import { useMemo, useState } from 'react';
import { Plus, Inbox, Calendar, LayoutGrid, ArrowUpRight, Tag, SlidersHorizontal } from 'lucide-react';
import { AnimatePresence } from 'framer-motion';
import { TaskItem } from './components/TaskItem';
import { useTaskStore } from './features/tasks/useTaskStore';
import { EditTaskModal } from './components/EditTaskModal';
import { ProjectList } from './components/ProjectList';
import { LabelManager } from './components/LabelManager';
import { FilterManager } from './components/FilterManager';

export default function App() { 
  const today = new Date();
  const formattedDate = today.toLocaleDateString('en-US', { weekday: 'long', day: 'numeric', month: 'long' });
  
  const { tasks, projects, filters, currentView, activeProjectId, activeFilterId, setCurrentView, setActiveFilterId, addTask, deleteTask, toggleTaskCompletion, setEditingTask } = useTaskStore();

  const handleAddTask = (e: React.FormEvent<HTMLFormElement>, text: string, date: string | null, labels: string[]) => {
    e.preventDefault();
    addTask(text, date, labels);
  };
  
  const activeProject = useMemo(() => projects.find(p => p.id === activeProjectId), [projects, activeProjectId]);
  const activeFilter = useMemo(() => filters.find(f => f.id === activeFilterId), [filters, activeFilterId]);

  const filteredTasks = useMemo(() => {
    const todayDateString = new Date().toISOString().split('T')[0];
    
    if (currentView === 'filters' && activeFilter?.query.label) {
      return tasks.filter(task => task.labels?.includes(activeFilter.query.label!));
    }

    switch (currentView) {
      case 'today':
        return tasks.filter(task => task.dueDate === todayDateString);
      case 'projects':
      case 'inbox':
      default:
        return tasks.filter(task => task.projectId === activeProjectId);
    }
  }, [tasks, currentView, activeProjectId, activeFilter]);

  const viewTitles: Record<string, string> = {
    inbox: 'Inbox',
    today: 'Today',
    upcoming: 'Upcoming',
    projects: activeProject?.name || 'Project',
    filters: activeFilter?.name || 'Filters & Labels'
  };

  return (
    <div className="flex h-screen bg-background font-sans text-text-primary">
      <nav className="w-64 border-r border-border p-6 pt-8 flex-shrink-0 flex flex-col">
        <div className="flex-grow">
          <div className="flex items-center gap-3 mb-10">
            <div className="w-8 h-8 bg-primary rounded-lg flex-shrink-0"></div>
            <h1 className="text-xl font-bold">Flowdo</h1>
          </div>
          <ul className="space-y-2">
            <li><button onClick={() => setCurrentView('inbox')} className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${currentView === 'inbox' ? 'bg-surface text-text-primary font-semibold' : 'hover:bg-surface text-text-secondary'}`}><Inbox size={20} /><span>Inbox</span></button></li>
            <li><button onClick={() => setCurrentView('today')} className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${currentView === 'today' ? 'bg-surface text-text-primary font-semibold' : 'hover:bg-surface text-text-secondary'}`}><Calendar size={20} /><span>Today</span></button></li>
            <li><button onClick={() => setCurrentView('upcoming')} className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${currentView === 'upcoming' ? 'bg-surface text-text-primary font-semibold' : 'hover:bg-surface text-text-secondary'}`}><ArrowUpRight size={20} /><span>Upcoming</span></button></li>
            <li><button onClick={() => setCurrentView('filters')} className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${(currentView === 'filters' && !activeFilterId) ? 'bg-surface text-text-primary font-semibold' : 'hover:bg-surface text-text-secondary'}`}><LayoutGrid size={20} /><span>Filters & Labels</span></button></li>
          </ul>
          
          <ProjectList />

          <div className="mt-6 pt-4 border-t border-border">
            <h2 className="text-sm font-semibold text-text-secondary px-3 mb-2">Filters</h2>
            <ul className="space-y-1">
              {filters.map(filter => (
                <li key={filter.id}>
                  <button
                    onClick={() => setActiveFilterId(filter.id)}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors text-sm ${
                      activeFilterId === filter.id ? 'bg-surface text-text-primary font-semibold' : 'hover:bg-surface text-text-secondary'
                    }`}
                  >
                    <SlidersHorizontal size={16} />
                    <span>{filter.name}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </nav>

      <main className="flex-1 p-8 pt-6 flex flex-col max-w-4xl mx-auto">
        <EditTaskModal />
        
        <header className="mb-6">
          <h1 className="text-3xl font-bold">{viewTitles[currentView]}</h1>
          <p className="text-text-secondary">{formattedDate}</p>
        </header>

        {(currentView === 'filters' && !activeFilterId) ? (
          <div>
            <LabelManager />
            <hr className="border-border my-8" />
            <FilterManager />
          </div>
        ) : (
          <>
            {currentView !== 'today' && currentView !=='filters' && (
              <>
                <AddTaskForm onAddTask={handleAddTask} />
                <hr className="border-border mb-4" />
              </>
            )}

            <div className="flex-1 overflow-y-auto pr-2 space-y-3">
              <AnimatePresence>
                {filteredTasks.length > 0 ? (
                  filteredTasks.map(task => (
                    <TaskItem key={task.id} task={task} onToggleComplete={() => toggleTaskCompletion(task.id)} onDelete={() => deleteTask(task.id)} onEdit={setEditingTask} />
                  ))
                ) : (
                  <div className="text-center text-text-secondary mt-20">
                    <p>All clear!</p>
                  </div>
                )}
              </AnimatePresence>
            </div>
          </>
        )}
      </main>
    </div>
  );
}

function AddTaskForm({ onAddTask }: { onAddTask: (e: React.FormEvent<HTMLFormElement>, text: string, date: string | null, labels: string[]) => void }) {
  const { labels: allLabels } = useTaskStore();
  const [text, setText] = useState('');
  const [date, setDate] = useState<string | null>(null);
  const [selectedLabels, setSelectedLabels] = useState<string[]>([]);
  const [showLabels, setShowLabels] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    onAddTask(e, text, date, selectedLabels);
    setText('');
    setDate(null);
    setSelectedLabels([]);
    setShowLabels(false);
  }

  const handleToggleLabel = (label: string) => {
    setSelectedLabels(prev => 
      prev.includes(label) ? prev.filter(l => l !== label) : [...prev, label]
    );
  };

  return (
    <form onSubmit={handleSubmit} className="bg-surface p-4 rounded-lg border border-border">
      <div className="flex flex-wrap items-center gap-2">
        <input type="text" value={text} onChange={(e) => setText(e.target.value)} placeholder="Add a new task..." className="flex-grow bg-background border border-border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary" />
        <input type="date" value={date || ''} onChange={(e) => setDate(e.target.value)} className="bg-background border border-border rounded-lg px-4 py-2 text-text-secondary focus:outline-none focus:ring-2 focus:ring-primary" />
        <button type="button" onClick={() => setShowLabels(!showLabels)} className="p-2 bg-background border border-border rounded-lg text-text-secondary hover:text-primary"><Tag size={20}/></button>
        <button type="submit" className="flex items-center gap-2 px-4 py-2 font-semibold text-white bg-primary rounded-lg hover:bg-primary-hover disabled:opacity-50" disabled={!text.trim()}>
          <Plus size={20} />
          <span>Add</span>
        </button>
      </div>
      {showLabels && (
        <div className="flex flex-wrap gap-2 pt-3">
          {allLabels.length > 0 ? allLabels.map(label => {
            const isSelected = selectedLabels.includes(label);
            return (
              <button
                type="button"
                key={label}
                onClick={() => handleToggleLabel(label)}
                className={`px-2 py-1 text-xs rounded-full border transition-colors ${
                  isSelected ? 'bg-primary/20 border-primary text-primary' : 'border-border hover:border-gray-600'
                }`}
              >
                {label}
              </button>
            )
          }) : <p className="text-xs text-text-secondary">No labels exist. Add one in the "Filters & Labels" page.</p>}
        </div>
      )}
    </form>
  )
}