import { useState } from 'react';
import { useTaskStore } from '../features/tasks/useTaskStore';
import { Plus, Folder, Trash2 } from 'lucide-react';

// ✅ Made onSelect optional
interface ProjectListProps {
  onSelect?: () => void;
}

export function ProjectList({ onSelect }: ProjectListProps) {
  const { projects, activeProjectId, addProject, setActiveProjectId, deleteProject } = useTaskStore();
  const [newProjectName, setNewProjectName] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  const handleAddProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (newProjectName.trim()) {
      addProject(newProjectName.trim());
      setNewProjectName('');
      setIsAdding(false);
    }
  };

  const handleDeleteProject = (e: React.MouseEvent, projectId: string) => {
    e.stopPropagation(); 
    if (window.confirm("Are you sure you want to delete this project? All its tasks will be moved to the Inbox.")) {
        deleteProject(projectId);
    }
  }

  return (
    <div className="mt-6 pt-4 border-t border-border">
      <div className="flex justify-between items-center mb-2 px-3">
        <h2 className="text-sm font-semibold text-text-secondary">Projects</h2>
        <button onClick={() => setIsAdding(!isAdding)} className="text-text-secondary hover:text-text-primary">
          <Plus size={16} />
        </button>
      </div>
      
      {isAdding && (
        <form onSubmit={handleAddProject} className="flex gap-2 p-1">
          <input
            type="text"
            autoFocus
            value={newProjectName}
            onChange={(e) => setNewProjectName(e.target.value)}
            placeholder="New project name"
            className="w-full bg-background text-sm rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </form>
      )}

      <ul className="space-y-1 mt-2">
        {projects.filter(p => p.name !== 'Inbox').map(project => (
          <li key={project.id}>
            <button
              onClick={() => {
                  setActiveProjectId(project.id);
                  onSelect?.(); // ✅ Call only if defined
              }}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors text-sm group ${
                activeProjectId === project.id ? 'bg-surface text-text-primary font-semibold' : 'hover:bg-surface text-text-secondary'
              }`}
            >
              <Folder size={16} />
              <span className="truncate flex-grow text-left">{project.name}</span>
              <span 
                onClick={(e) => handleDeleteProject(e, project.id)}
                className="opacity-0 group-hover:opacity-100 text-text-secondary hover:text-red-500"
              >
                  <Trash2 size={14}/>
              </span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
