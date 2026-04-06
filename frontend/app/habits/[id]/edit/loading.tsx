export default function EditHabitLoading(): React.ReactNode {
  return (
    <div className="max-w-lg mx-auto px-4 py-8 space-y-6 animate-pulse">
      <div className="h-9 w-48 rounded-md bg-slate-200 mb-8" />

      <div className="space-y-2">
        <div className="h-4 w-16 rounded bg-slate-200" />
        <div className="h-10 w-full rounded-md bg-slate-200" />
      </div>

      <div className="space-y-2">
        <div className="h-4 w-24 rounded bg-slate-200" />
        <div className="h-24 w-full rounded-md bg-slate-200" />
      </div>

      <div className="flex gap-3">
        <div className="h-10 w-32 rounded-md bg-slate-200" />
        <div className="h-10 w-24 rounded-md bg-slate-200" />
      </div>
    </div>
  );
}
