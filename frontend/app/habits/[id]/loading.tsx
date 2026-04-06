export default function HabitDetailLoading(): React.ReactNode {
  return (
    <div className="max-w-3xl mx-auto px-4 py-8 space-y-6 animate-pulse">
      {/* Header */}
      <div className="space-y-2">
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <div className="h-8 w-64 rounded-md bg-slate-200" />
            <div className="h-4 w-48 rounded bg-slate-200" />
          </div>
          <div className="h-6 w-20 rounded-full bg-slate-200" />
        </div>
        <div className="h-4 w-32 rounded bg-slate-200" />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="rounded-lg border border-slate-200 bg-slate-50 p-4 space-y-2">
            <div className="h-4 w-24 rounded bg-slate-200" />
            <div className="h-8 w-12 rounded bg-slate-200" />
          </div>
        ))}
      </div>

      {/* Check-in button */}
      <div className="h-11 w-48 rounded-md bg-slate-200" />

      {/* Calendar */}
      <div className="rounded-lg border border-slate-200 bg-white p-6">
        <div className="mb-6 flex items-center justify-between">
          <div className="h-6 w-32 rounded bg-slate-200" />
          <div className="flex gap-2">
            <div className="h-7 w-16 rounded bg-slate-200" />
            <div className="h-7 w-16 rounded bg-slate-200" />
          </div>
        </div>
        <div className="grid grid-cols-7 gap-1">
          {Array.from({ length: 35 }).map((_, i) => (
            <div key={i} className="aspect-square rounded bg-slate-100" />
          ))}
        </div>
      </div>
    </div>
  );
}
