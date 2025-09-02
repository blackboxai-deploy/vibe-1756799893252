'use client';

import { useState, useEffect } from 'react';
import { Task } from '@/lib/types';
import { useKanbanStore } from '@/lib/store';
import { KanbanColumn } from './KanbanColumn';
import { TaskModal } from './TaskModal';
import { AddColumnDialog } from './AddColumnDialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';

export function KanbanBoard() {
  const {
    columns,
    loading,
    addTask,
    updateTask,
    deleteTask,
    moveTask,
    addColumn,
    deleteColumn,
  } = useKanbanStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [taskModal, setTaskModal] = useState<{
    open: boolean;
    task?: Task;
    columnId?: string;
  }>({ open: false });
  const [columnModal, setColumnModal] = useState(false);

  // Handle task movement via custom event
  useEffect(() => {
    const handleMoveTask = (e: CustomEvent) => {
      const { taskId, sourceColumnId, targetColumnId } = e.detail;
      moveTask(taskId, sourceColumnId, targetColumnId);
    };

    window.addEventListener('moveTask', handleMoveTask as EventListener);
    return () => window.removeEventListener('moveTask', handleMoveTask as EventListener);
  }, [moveTask]);

  const handleAddTask = (columnId: string) => {
    setTaskModal({ open: true, columnId, task: undefined });
  };

  const handleEditTask = (task: Task) => {
    setTaskModal({ open: true, task });
  };

  const handleTaskSave = (data: {
    title: string;
    description?: string;
    priority: 'low' | 'medium' | 'high';
  }) => {
    if (taskModal.task) {
      // Update existing task
      updateTask(taskModal.task.id, data);
    } else if (taskModal.columnId) {
      // Add new task
      addTask(taskModal.columnId, data.title, data.description, data.priority);
    }
  };

  const handleTaskDelete = (taskId: string) => {
    const confirmed = window.confirm('Are you sure you want to delete this task?');
    if (confirmed) {
      deleteTask(taskId);
    }
  };

  const handleColumnAdd = (title: string, color: string) => {
    addColumn(title, color);
  };

  const handleColumnDelete = (columnId: string) => {
    deleteColumn(columnId);
  };

  const getColumnTitle = (columnId?: string): string => {
    if (!columnId) return '';
    const column = columns.find(col => col.id === columnId);
    return column?.title || '';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-pulse flex space-x-4">
          <div className="h-8 w-32 bg-gray-300 rounded"></div>
          <div className="h-8 w-32 bg-gray-300 rounded"></div>
          <div className="h-8 w-32 bg-gray-300 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Kanban Board</h1>
          <p className="text-sm text-gray-600 mt-1">
            Organize your tasks and track progress
          </p>
        </div>
        
        <div className="flex gap-2 w-full sm:w-auto">
          <Input
            placeholder="Search tasks..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full sm:w-64"
          />
          <Button onClick={() => setColumnModal(true)}>
            Add Column
          </Button>
        </div>
      </div>

      {/* Board */}
      <div className="overflow-x-auto pb-4">
        <div className="flex gap-6 min-w-fit">
          {columns.map((column) => (
            <KanbanColumn
              key={column.id}
              column={column}
              searchQuery={searchQuery}
              onAddTask={handleAddTask}
              onEditTask={handleEditTask}
              onDeleteTask={handleTaskDelete}
              onDeleteColumn={handleColumnDelete}
            />
          ))}
          
          {/* Add Column Card */}
          <Card className="flex-shrink-0 min-w-[280px] max-w-[350px] border-2 border-dashed border-gray-300 hover:border-gray-400 transition-colors">
            <button
              onClick={() => setColumnModal(true)}
              className="w-full h-full min-h-[200px] flex flex-col items-center justify-center text-gray-500 hover:text-gray-700 p-8"
            >
              <div className="text-4xl mb-2">➕</div>
              <p className="text-sm font-medium">Add New Column</p>
              <p className="text-xs text-gray-400 mt-1">Create a new workflow stage</p>
            </button>
          </Card>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 border-t border-gray-200">
        <div className="text-center">
          <div className="text-2xl font-bold text-gray-900">
            {columns.reduce((acc, col) => acc + col.tasks.length, 0)}
          </div>
          <div className="text-sm text-gray-600">Total Tasks</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-blue-600">
            {columns.find(col => col.title.toLowerCase().includes('progress'))?.tasks.length || 0}
          </div>
          <div className="text-sm text-gray-600">In Progress</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-green-600">
            {columns.find(col => col.title.toLowerCase().includes('done'))?.tasks.length || 0}
          </div>
          <div className="text-sm text-gray-600">Completed</div>
        </div>
      </div>

      {/* Modals */}
      <TaskModal
        open={taskModal.open}
        onClose={() => setTaskModal({ open: false })}
        onSave={handleTaskSave}
        task={taskModal.task}
        columnTitle={getColumnTitle(taskModal.columnId)}
      />

      <AddColumnDialog
        open={columnModal}
        onClose={() => setColumnModal(false)}
        onAdd={handleColumnAdd}
      />
    </div>
  );
}