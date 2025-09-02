'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface AddColumnDialogProps {
  open: boolean;
  onClose: () => void;
  onAdd: (title: string, color: string) => void;
}

const columnColors = [
  { value: 'bg-slate-100', label: 'Gray', preview: 'bg-slate-300' },
  { value: 'bg-red-100', label: 'Red', preview: 'bg-red-300' },
  { value: 'bg-orange-100', label: 'Orange', preview: 'bg-orange-300' },
  { value: 'bg-yellow-100', label: 'Yellow', preview: 'bg-yellow-300' },
  { value: 'bg-green-100', label: 'Green', preview: 'bg-green-300' },
  { value: 'bg-blue-100', label: 'Blue', preview: 'bg-blue-300' },
  { value: 'bg-indigo-100', label: 'Indigo', preview: 'bg-indigo-300' },
  { value: 'bg-purple-100', label: 'Purple', preview: 'bg-purple-300' },
  { value: 'bg-pink-100', label: 'Pink', preview: 'bg-pink-300' },
];

export function AddColumnDialog({ open, onClose, onAdd }: AddColumnDialogProps) {
  const [title, setTitle] = useState('');
  const [color, setColor] = useState('bg-slate-100');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    onAdd(title.trim(), color);
    setTitle('');
    setColor('bg-slate-100');
    onClose();
  };

  const handleClose = () => {
    setTitle('');
    setColor('bg-slate-100');
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle>Add New Column</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="column-title">Column Title</Label>
            <Input
              id="column-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter column title..."
              required
              autoFocus
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="column-color">Column Color</Label>
            <Select value={color} onValueChange={setColor}>
              <SelectTrigger id="column-color">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {columnColors.map((colorOption) => (
                  <SelectItem key={colorOption.value} value={colorOption.value}>
                    <div className="flex items-center gap-2">
                      <div className={`w-4 h-4 rounded ${colorOption.preview} border border-gray-300`} />
                      {colorOption.label}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={!title.trim()}>
              Add Column
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}