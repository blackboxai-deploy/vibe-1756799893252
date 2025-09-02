'use client';

import { useState } from 'react';
import { Task } from '@/lib/types';
import { getPriorityColor, getPriorityDot, formatDate } from '@/lib/kanban-utils';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (taskId: string) => void;
}

export function TaskCard({ task, onEdit, onDelete }: TaskCardProps) {
  const [isDragging, setIsDragging] = useState(false);

  const handleDragStart = (e: React.DragEvent) => {
    setIsDragging(true);
    e.dataTransfer.setData('text/plain', JSON.stringify({
      taskId: task.id,
      sourceColumnId: task.columnId,
    }));
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragEnd = () => {
    setIsDragging(false);
  };

  return (
    <Card
      draggable
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      className={`cursor-grab active:cursor-grabbing transition-all duration-200 hover:shadow-md ${
        isDragging ? 'opacity-50 rotate-2 scale-105' : ''
      }`}
    >
      <CardContent className="p-4">
        <div className="space-y-3">
          {/* Header with priority and menu */}
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${getPriorityDot(task.priority)}`} />
              <Badge variant="outline" className={`text-xs ${getPriorityColor(task.priority)}`}>
                {task.priority.toUpperCase()}
              </Badge>
            </div>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-6 w-6 p-0 text-gray-500 hover:text-gray-700">
                  <span className="sr-only">Task options</span>
                  <div className="flex flex-col gap-0.5">
                    <div className="w-1 h-1 bg-current rounded-full" />
                    <div className="w-1 h-1 bg-current rounded-full" />
                    <div className="w-1 h-1 bg-current rounded-full" />
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-32">
                <DropdownMenuItem onClick={() => onEdit(task)}>
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => onDelete(task.id)}
                  className="text-red-600 hover:text-red-700"
                >
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Task title */}
          <h3 className="font-medium text-sm leading-tight text-gray-900">
            {task.title}
          </h3>

          {/* Task description */}
          {task.description && (
            <p className="text-xs text-gray-600 leading-relaxed">
              {task.description}
            </p>
          )}

          {/* Footer with date */}
          <div className="pt-2 border-t border-gray-100">
            <p className="text-xs text-gray-500">
              {formatDate(task.updatedAt)}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}