"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import type { Habit, CheckIn } from "@habit/shared";
import { HabitStatus } from "@habit/shared";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { CalendarView } from "@/components/CalendarView/CalendarView";
import { TodayCheckInButton } from "@/components/HabitDetails/TodayCheckInButton";
import { apiClient } from "@/lib/api";
import { cn } from "@/lib/utils";

interface HabitDetailsProps {
  habit: Habit;
  checkIns: CheckIn[];
  isCheckedInToday: boolean;
}

export function HabitDetails({
  habit,
  checkIns,
  isCheckedInToday,
}: HabitDetailsProps): React.ReactNode {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState<boolean>(false);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [currentHabit, setCurrentHabit] = useState<Habit>(habit);
  const [currentCheckedIn, setCurrentCheckedIn] = useState<boolean>(
    isCheckedInToday
  );

  async function handleUpdateStatus(newStatus: HabitStatus): Promise<void> {
    try {
      setIsUpdatingStatus(true);
      setError(null);
      const updated = await apiClient.updateHabit(habit.id, {
        status: newStatus,
      });
      setCurrentHabit(updated);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to update habit";
      setError(errorMessage);
    } finally {
      setIsUpdatingStatus(false);
    }
  }

  async function handleDelete(): Promise<void> {
    try {
      setIsDeleting(true);
      setError(null);
      await apiClient.deleteHabit(habit.id);
      router.push("/habits");
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to delete habit";
      setError(errorMessage);
      setShowDeleteDialog(false);
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <div className="space-y-6">
      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Header with habit name and status */}
      <div className="space-y-2">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">
              {currentHabit.name}
            </h1>
            {currentHabit.description && (
              <p className="mt-1 text-slate-600">{currentHabit.description}</p>
            )}
          </div>
          <span
            className={cn(
              "rounded-full px-3 py-1 text-sm font-medium",
              currentHabit.status === HabitStatus.ACTIVE
                ? "bg-green-100 text-green-800"
                : currentHabit.status === HabitStatus.PAUSED
                  ? "bg-yellow-100 text-yellow-800"
                  : "bg-slate-100 text-slate-800"
            )}
          >
            {currentHabit.status}
          </span>
        </div>
        <p className="text-sm text-slate-500">
          Started: {new Date(currentHabit.startDate).toLocaleDateString()}
        </p>
      </div>

      {/* Quick stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
          <div className="text-sm text-slate-600">Current Streak</div>
          <div className="mt-1 text-3xl font-bold text-green-600">
            {currentHabit.currentStreak}
          </div>
        </div>
        <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
          <div className="text-sm text-slate-600">Best Streak</div>
          <div className="mt-1 text-3xl font-bold text-slate-900">
            {currentHabit.bestStreak}
          </div>
        </div>
        <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
          <div className="text-sm text-slate-600">Total Check-ins</div>
          <div className="mt-1 text-3xl font-bold text-slate-900">
            {currentHabit.totalCheckIns}
          </div>
        </div>
      </div>

      {/* Today's check-in */}
      <div>
        <h2 className="mb-3 text-lg font-semibold text-slate-900">
          Today&apos;s Progress
        </h2>
        <TodayCheckInButton
          habitId={habit.id}
          isCheckedInToday={currentCheckedIn}
          onSuccess={async (isCheckedIn) => {
            setCurrentCheckedIn(isCheckedIn);
            const updated = await apiClient.getHabit(habit.id);
            setCurrentHabit(updated);
          }}
        />
      </div>

      {/* Calendar */}
      <div>
        <h2 className="mb-3 text-lg font-semibold text-slate-900">
          Check-in History
        </h2>
        <CalendarView habit={currentHabit} checkIns={checkIns} />
      </div>

      {/* Status actions */}
      <div className="space-y-2">
        <p className="text-sm font-medium text-slate-700">Status Actions</p>
        <div className="flex flex-wrap gap-2">
          {currentHabit.status !== HabitStatus.ACTIVE && (
            <Button
              onClick={() => handleUpdateStatus(HabitStatus.ACTIVE)}
              disabled={isUpdatingStatus || currentHabit.status === HabitStatus.ARCHIVED}
              variant="outline"
            >
              Activate
            </Button>
          )}
          {currentHabit.status !== HabitStatus.PAUSED && (
            <Button
              onClick={() => handleUpdateStatus(HabitStatus.PAUSED)}
              disabled={isUpdatingStatus || currentHabit.status === HabitStatus.ARCHIVED}
              variant="outline"
            >
              Pause
            </Button>
          )}
          {currentHabit.status !== HabitStatus.ARCHIVED && (
            <Button
              onClick={() => handleUpdateStatus(HabitStatus.ARCHIVED)}
              disabled={isUpdatingStatus}
              variant="outline"
            >
              Archive
            </Button>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-2 border-t border-slate-200 pt-4">
        <Button asChild variant="outline">
          <Link href={`/habits/${habit.id}/edit`}>Edit Details</Link>
        </Button>
        <Button
          onClick={() => setShowDeleteDialog(true)}
          disabled={isDeleting}
          variant="destructive"
        >
          Delete Habit
        </Button>
        <Button asChild variant="outline">
          <Link href="/habits">Back to List</Link>
        </Button>
      </div>
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              Confirm deletion of the habit: {currentHabit.name}
            </DialogTitle>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowDeleteDialog(false)}
              disabled={isDeleting}
            >
              Cancel
            </Button>
            <Button
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              {isDeleting ? "Deleting..." : "Confirm"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
