'use client';

import { HabitStatus } from '@habit/shared';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export type FilterOption = 'ALL' | HabitStatus;

interface FiltersProps {
  selectedFilter: FilterOption;
  onFilterChange: (filter: FilterOption) => void;
}

const FILTER_OPTIONS: { label: string; value: FilterOption }[] = [
  { label: 'All', value: 'ALL' },
  { label: 'Active', value: HabitStatus.ACTIVE },
  { label: 'Paused', value: HabitStatus.PAUSED },
  { label: 'Archived', value: HabitStatus.ARCHIVED },
];

export function Filters({
  selectedFilter,
  onFilterChange,
}: FiltersProps): React.ReactNode {
  return (
    <div className="flex flex-wrap gap-2">
      {FILTER_OPTIONS.map((option) => (
        <Button
          key={option.value}
          variant={selectedFilter === option.value ? 'default' : 'outline'}
          size="sm"
          onClick={() => onFilterChange(option.value)}
          className={cn(
            'transition-colors',
            selectedFilter === option.value
              ? 'bg-slate-900 text-white hover:bg-slate-800'
              : 'text-slate-700 hover:bg-slate-100',
          )}
        >
          {option.label}
        </Button>
      ))}
    </div>
  );
}
