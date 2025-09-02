export type Priority = 'low' | 'medium' | 'high';

export interface Task {
  id: string;
  title: string;
  description?: string;
  priority: Priority;
  columnId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Column {
  id: string;
  title: string;
  tasks: Task[];
  color?: string;
}

export interface KanbanBoard {
  columns: Column[];
}

export interface DragData {
  taskId: string;
  sourceColumnId: string;
}