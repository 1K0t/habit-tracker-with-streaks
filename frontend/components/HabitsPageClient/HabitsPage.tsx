"use client";

import { useState } from "react";
import Link from "next/link";
import type { Habit } from "@habit/shared";
import { useHabits } from "@/hooks/useHabits";
import { SearchInput } from "@/components/SearchInput/SearchInput";
import { Filters, type FilterOption } from "@/components/Filters/Filters";
import { HabitList } from "@/components/HabitList/HabitList";
import { Button } from "@/components/ui/button";

interface HabitsPageClientProps {
  initialHabits: Habit[];
  error?: string;
}

export function HabitsPageClient({
  initialHabits,
  error,
}: HabitsPageClientProps): React.ReactNode {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedFilter, setSelectedFilter] = useState<FilterOption>("ALL");

  const { habits } = useHabits(initialHabits);

  const filteredHabits = habits.filter((habit) => {
    const matchesSearch = habit.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesFilter =
      selectedFilter === "ALL" || habit.status === selectedFilter;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-slate-900">My Habits</h1>
        <Button asChild>
          <Link href="/habits/create">Create Habit</Link>
        </Button>
      </div>

      {error ? (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-700">
          {error}
        </div>
      ) : (
        <>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center mb-6">
            <SearchInput
              value={searchTerm}
              onChange={setSearchTerm}
              className="sm:max-w-xs"
            />
            <Filters
              selectedFilter={selectedFilter}
              onFilterChange={setSelectedFilter}
            />
          </div>
          <HabitList habits={filteredHabits} />
        </>
      )}
    </div>
  );
}
