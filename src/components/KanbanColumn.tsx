'use client';

import { useState } from 'react';
import { Column, Task } from '@/lib/types';
import { filterTasks } from '@/lib/kanban-utils';
import { TaskCard } from './TaskCard';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface KanbanColumnProps {
  column: Column;
  searchQuery: string;
  onAddTask: (columnId: string) => void;
  onEditTask: (task: Task) => void;
  onDeleteTask: (taskId: string) => void;
  onDeleteColumn: (columnId: string) => void;
}

export function KanbanColumn({
  column,
  searchQuery,
  onAddTask,
  onEditTask,
  onDeleteTask,
  onDeleteColumn,
}: KanbanColumnProps) {
  const [isDragOver, setIsDragOver] = useState(false);

  const filteredTasks = filterTasks(column.tasks, searchQuery);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    try {
      const data = JSON.parse(e.dataTransfer.getData('text/plain'));
      const { taskId, sourceColumnId } = data;
      
      if (sourceColumnId !== column.id) {
        // Emit event to parent to handle the move
        const event = new CustomEvent('moveTask', {
          detail: { taskId, sourceColumnId, targetColumnId: column.id }
        });
        window.dispatchEvent(event);
      }
    } catch (error) {
      console.error('Error handling drop:', error);
    }
  };

  const handleDeleteColumn = () => {
    if (column.tasks.length > 0) {
      const confirmed = window.confirm(
        `Are you sure you want to delete "${column.title}"? This will also delete all ${column.tasks.length} task(s) in this column.`
      );
      if (!confirmed) return;
    }
    onDeleteColumn(column.id);
  };

  return (
    <Card className="flex-1 min-w-[280px] max-w-[350px] h-fit">
      <CardHeader className={`${column.color || 'bg-slate-100'} rounded-t-lg border-b`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h2 className="font-semibold text-gray-800">{column.title}</h2>
            <Badge variant="secondary" className="text-xs">
              {filteredTasks.length}
            </Badge>
          </div>
          
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onAddTask(column.id)}
              className="h-7 w-7 p-0 text-gray-600 hover:text-gray-800"
            >
              <span className="sr-only">Add task</span>
              <div className="text-lg font-bold">+</div>
            </Button>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-7 w-7 p-0 text-gray-600 hover:text-gray-800">
                  <span className="sr-only">Column options</span>
                  <div className="flex flex-col gap-0.5">
                    <div className="w-1 h-1 bg-current rounded-full" />
                    <div className="w-1 h-1 bg-current rounded-full" />
                    <div className="w-1 h-1 bg-current rounded-full" />
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-40">
                <DropdownMenuItem onClick={() => onAddTask(column.id)}>
                  Add Task
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={handleDeleteColumn}
                  className="text-red-600 hover:text-red-700"
                >
                  Delete Column
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </CardHeader>
      
      <CardContent 
        className={`p-4 min-h-[200px] space-y-3 transition-colors ${
          isDragOver ? 'bg-blue-50 border-blue-300' : ''
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {filteredTasks.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-gray-500">
            <div className="text-4xl mb-2 opacity-50">📝</div>
            <p className="text-sm text-center">
              {searchQuery ? 'No tasks match your search' : 'No tasks yet'}
            </p>
            {!searchQuery && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onAddTask(column.id)}
                className="mt-2 text-xs text-gray-500 hover:text-gray-700"
              >
                Add your first task
              </Button>
            )}
          </div>
        ) : (
          filteredTasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onEdit={onEditTask}
              onDelete={onDeleteTask}
            />
          ))
        )}
      </CardContent>
    </Card>
  );
}