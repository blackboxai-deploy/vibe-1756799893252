import { Task, Column, Priority } from './types';

export const generateId = (): string => {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
};

export const getPriorityColor = (priority: Priority): string => {
  switch (priority) {
    case 'high':
      return 'bg-red-100 text-red-800 border-red-200';
    case 'medium':
      return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    case 'low':
      return 'bg-green-100 text-green-800 border-green-200';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};

export const getPriorityDot = (priority: Priority): string => {
  switch (priority) {
    case 'high':
      return 'bg-red-500';
    case 'medium':
      return 'bg-yellow-500';
    case 'low':
      return 'bg-green-500';
    default:
      return 'bg-gray-500';
  }
};

export const formatDate = (date: Date): string => {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(date));
};

export const moveTask = (
  columns: Column[],
  taskId: string,
  sourceColumnId: string,
  targetColumnId: string
): Column[] => {
  const newColumns = columns.map(column => ({ ...column, tasks: [...column.tasks] }));
  
  const sourceColumn = newColumns.find(col => col.id === sourceColumnId);
  const targetColumn = newColumns.find(col => col.id === targetColumnId);
  
  if (!sourceColumn || !targetColumn) return columns;
  
  const taskIndex = sourceColumn.tasks.findIndex(task => task.id === taskId);
  if (taskIndex === -1) return columns;
  
  const [movedTask] = sourceColumn.tasks.splice(taskIndex, 1);
  movedTask.columnId = targetColumnId;
  movedTask.updatedAt = new Date();
  
  targetColumn.tasks.push(movedTask);
  
  return newColumns;
};

export const filterTasks = (tasks: Task[], searchQuery: string): Task[] => {
  if (!searchQuery.trim()) return tasks;
  
  const query = searchQuery.toLowerCase();
  return tasks.filter(
    task =>
      task.title.toLowerCase().includes(query) ||
      task.description?.toLowerCase().includes(query)
  );
};

export const getDefaultColumns = (): Column[] => [
  {
    id: 'todo',
    title: 'To Do',
    tasks: [],
    color: 'bg-slate-100'
  },
  {
    id: 'in-progress',
    title: 'In Progress',
    tasks: [],
    color: 'bg-blue-100'
  },
  {
    id: 'done',
    title: 'Done',
    tasks: [],
    color: 'bg-green-100'
  }
];