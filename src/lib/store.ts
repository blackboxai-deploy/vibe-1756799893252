'use client';

import { useState, useEffect } from 'react';
import { Task, Column } from './types';
import { getDefaultColumns, generateId } from './kanban-utils';

const STORAGE_KEY = 'kanban-board';

export const useKanbanStore = () => {
  const [columns, setColumns] = useState<Column[]>([]);
  const [loading, setLoading] = useState(true);

  // Load data from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsedData = JSON.parse(stored);
        // Convert date strings back to Date objects
        const columnsWithDates = parsedData.map((column: Column) => ({
          ...column,
          tasks: column.tasks.map((task: Task) => ({
            ...task,
            createdAt: new Date(task.createdAt),
            updatedAt: new Date(task.updatedAt),
          })),
        }));
        setColumns(columnsWithDates);
      } else {
        setColumns(getDefaultColumns());
      }
    } catch (error) {
      console.error('Error loading kanban data:', error);
      setColumns(getDefaultColumns());
    } finally {
      setLoading(false);
    }
  }, []);

  // Save to localStorage whenever columns change
  useEffect(() => {
    if (!loading && columns.length > 0) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(columns));
      } catch (error) {
        console.error('Error saving kanban data:', error);
      }
    }
  }, [columns, loading]);

  const addTask = (columnId: string, title: string, description?: string, priority: 'low' | 'medium' | 'high' = 'medium') => {
    const newTask: Task = {
      id: generateId(),
      title,
      description,
      priority,
      columnId,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    setColumns(prevColumns =>
      prevColumns.map(column =>
        column.id === columnId
          ? { ...column, tasks: [...column.tasks, newTask] }
          : column
      )
    );

    return newTask.id;
  };

  const updateTask = (taskId: string, updates: Partial<Omit<Task, 'id' | 'createdAt'>>) => {
    setColumns(prevColumns =>
      prevColumns.map(column => ({
        ...column,
        tasks: column.tasks.map(task =>
          task.id === taskId
            ? { ...task, ...updates, updatedAt: new Date() }
            : task
        ),
      }))
    );
  };

  const deleteTask = (taskId: string) => {
    setColumns(prevColumns =>
      prevColumns.map(column => ({
        ...column,
        tasks: column.tasks.filter(task => task.id !== taskId),
      }))
    );
  };

  const moveTask = (taskId: string, sourceColumnId: string, targetColumnId: string) => {
    setColumns(prevColumns => {
      const newColumns = prevColumns.map(column => ({
        ...column,
        tasks: [...column.tasks],
      }));

      const sourceColumn = newColumns.find(col => col.id === sourceColumnId);
      const targetColumn = newColumns.find(col => col.id === targetColumnId);

      if (!sourceColumn || !targetColumn) return prevColumns;

      const taskIndex = sourceColumn.tasks.findIndex(task => task.id === taskId);
      if (taskIndex === -1) return prevColumns;

      const [movedTask] = sourceColumn.tasks.splice(taskIndex, 1);
      movedTask.columnId = targetColumnId;
      movedTask.updatedAt = new Date();

      targetColumn.tasks.push(movedTask);

      return newColumns;
    });
  };

  const addColumn = (title: string, color?: string) => {
    const newColumn: Column = {
      id: generateId(),
      title,
      tasks: [],
      color: color || 'bg-gray-100',
    };

    setColumns(prevColumns => [...prevColumns, newColumn]);
    return newColumn.id;
  };

  const updateColumn = (columnId: string, updates: Partial<Omit<Column, 'id' | 'tasks'>>) => {
    setColumns(prevColumns =>
      prevColumns.map(column =>
        column.id === columnId ? { ...column, ...updates } : column
      )
    );
  };

  const deleteColumn = (columnId: string) => {
    setColumns(prevColumns => prevColumns.filter(column => column.id !== columnId));
  };

  const getTask = (taskId: string): Task | undefined => {
    for (const column of columns) {
      const task = column.tasks.find(t => t.id === taskId);
      if (task) return task;
    }
    return undefined;
  };

  return {
    columns,
    loading,
    addTask,
    updateTask,
    deleteTask,
    moveTask,
    addColumn,
    updateColumn,
    deleteColumn,
    getTask,
  };
};