import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { Task } from '../../components/TaskItem';

export type Project = {
  id: string;
  name: string;
};

export type Filter = {
  id: string;
  name: string;
  query: {
    label?: string;
  };
};

type State = {
  tasks: Task[];
  projects: Project[];
  labels: string[];
  filters: Filter[];
  currentView: 'inbox' | 'today' | 'upcoming' | 'filters' | 'projects';
  activeProjectId: string | null;
  activeFilterId: string | null;
  editingTask: Task | null;
};

type Actions = {
  addTask: (text: string, dueDate: string | null, labels: string[]) => void;
  deleteTask: (id: string) => void;
  toggleTaskCompletion: (id: string) => void;
  editTask: (id: string, newText: string, newDueDate: string | null, newLabels: string[]) => void;
  addProject: (name: string) => void;
  deleteProject: (projectId: string) => void;
  setCurrentView: (view: State['currentView']) => void;
  setEditingTask: (task: Task | null) => void;
  setActiveProjectId: (id: string) => void;
  addLabel: (label: string) => void;
  deleteLabel: (labelToDelete: string) => void;
  addFilter: (name: string, query: Filter['query']) => void;
  deleteFilter: (id: string) => void;
  setActiveFilterId: (id: string) => void;
};

export const useTaskStore = create<State & Actions>()(
  persist(
    (set, get) => ({
      // --- INITIAL STATE ---
      tasks: [],
      projects: [{ id: 'inbox', name: 'Inbox' }],
      labels: [],
      filters: [],
      currentView: 'inbox',
      activeProjectId: 'inbox',
      activeFilterId: null,
      editingTask: null,

      // --- ACTIONS ---
      addTask: (text, dueDate, labels) => {
        const newTask: Task = {
          id: crypto.randomUUID(),
          text,
          completed: false,
          dueDate,
          priority: 'p4',
          projectId: get().activeProjectId || 'inbox',
          labels,
        };
        set(state => ({ tasks: [newTask, ...state.tasks] }));
      },
      addProject: (name) => {
        const newProject: Project = { id: crypto.randomUUID(), name };
        set(state => ({ projects: [...state.projects, newProject] }));
      },
      deleteTask: (id) => {
        set(state => ({ tasks: state.tasks.filter(task => task.id !== id) }));
      },
      toggleTaskCompletion: (id) => {
        set(state => ({
          tasks: state.tasks.map(task =>
            task.id === id ? { ...task, completed: !task.completed } : task
          ),
        }));
      },
      editTask: (id, newText, newDueDate, newLabels) => {
        set(state => ({
          tasks: state.tasks.map(task =>
            task.id === id ? { ...task, text: newText, dueDate: newDueDate, labels: newLabels } : task
          ),
          editingTask: null,
        }));
      },
      deleteProject: (projectId) => {
        const inboxProject = get().projects.find(p => p.name === 'Inbox');
        if (!inboxProject || projectId === inboxProject.id) {
            alert("You cannot delete the default Inbox.");
            return;
        }
        set(state => ({
          tasks: state.tasks.map(task => 
            task.projectId === projectId ? { ...task, projectId: inboxProject.id } : task
          ),
          projects: state.projects.filter(p => p.id !== projectId),
          activeProjectId: inboxProject.id,
          currentView: 'inbox',
        }));
      },
      addLabel: (label) => {
        const newLabel = label.startsWith('@') ? label : `@${label}`;
        if (get().labels.includes(newLabel)) return;
        set(state => ({ labels: [...state.labels, newLabel].sort() }));
      },
      deleteLabel: (labelToDelete) => {
        set(state => ({
          labels: state.labels.filter(l => l !== labelToDelete),
          tasks: state.tasks.map(task => ({
            ...task,
            labels: task.labels?.filter(l => l !== labelToDelete),
          })),
        }));
      },
      addFilter: (name, query) => {
        const newFilter: Filter = { id: crypto.randomUUID(), name, query };
        set(state => ({ filters: [...state.filters, newFilter] }));
      },
      deleteFilter: (id) => {
        set(state => ({
          filters: state.filters.filter(f => f.id !== id),
          activeFilterId: state.activeFilterId === id ? null : state.activeFilterId,
        }));
      },
      setCurrentView: (view) => {
        const inboxProject = get().projects.find(p => p.name === 'Inbox');
        set({ 
            currentView: view, 
            activeFilterId: null, 
            activeProjectId: view === 'inbox' ? (inboxProject?.id || 'inbox') : get().activeProjectId 
        });
      },
      setActiveProjectId: (id) => set({ activeProjectId: id, currentView: 'projects', activeFilterId: null }),
      setEditingTask: (task) => set({ editingTask: task }),
      setActiveFilterId: (id) => set({ activeFilterId: id, currentView: 'filters', activeProjectId: null }),
    }),
    {
      name: 'flowdo-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);