'use client';

import { useState } from 'react';
import Link from 'next/link';
import type { CreateHabitDto } from '@habit/shared';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

interface HabitFormProps {
  onSubmit: (dto: CreateHabitDto) => Promise<void>;
  isLoading?: boolean;
}

interface FormErrors {
  name?: string;
  startDate?: string;
}

export function HabitForm({
  onSubmit,
  isLoading = false,
}: HabitFormProps): React.ReactNode {
  const today = new Date().toISOString().split('T')[0];

  const [name, setName] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [startDate, setStartDate] = useState<string>(today);
  const [errors, setErrors] = useState<FormErrors>({});

  function validate(): boolean {
    const newErrors: FormErrors = {};
    if (!name.trim()) newErrors.name = 'Name is required';
    if (!startDate) newErrors.startDate = 'Start date is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  async function handleSubmit(
    e: React.FormEvent<HTMLFormElement>,
  ): Promise<void> {
    e.preventDefault();
    if (!validate()) return;
    await onSubmit({
      name: name.trim(),
      description: description.trim() || undefined,
      startDate,
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <label htmlFor="name" className="text-sm font-medium text-slate-700">
          Name <span className="text-red-500">*</span>
        </label>
        <Input
          id="name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. Morning run"
          disabled={isLoading}
          className={cn(
            errors.name && 'border-red-500 focus-visible:ring-red-500',
          )}
        />
        {errors.name && <p className="text-sm text-red-600">{errors.name}</p>}
      </div>

      <div className="space-y-2">
        <label
          htmlFor="description"
          className="text-sm font-medium text-slate-700"
        >
          Description
        </label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Optional description..."
          rows={3}
          disabled={isLoading}
          className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-none"
        />
      </div>

      <div className="space-y-2">
        <label
          htmlFor="startDate"
          className="text-sm font-medium text-slate-700"
        >
          Start Date <span className="text-red-500">*</span>
        </label>
        <Input
          id="startDate"
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          disabled={isLoading}
          className={cn(
            errors.startDate && 'border-red-500 focus-visible:ring-red-500',
          )}
        />
        {errors.startDate && (
          <p className="text-sm text-red-600">{errors.startDate}</p>
        )}
      </div>

      <div className="flex gap-3">
        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Creating...' : 'Create Habit'}
        </Button>
        <Button type="button" variant="outline" asChild disabled={isLoading}>
          <Link href="/habits">Cancel</Link>
        </Button>
      </div>
    </form>
  );
}
