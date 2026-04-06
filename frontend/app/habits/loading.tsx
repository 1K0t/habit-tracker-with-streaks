export default function HabitsLoading(): React.ReactNode {
  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div className="h-9 w-40 rounded-md bg-slate-200 animate-pulse" />
        <div className="h-9 w-32 rounded-md bg-slate-200 animate-pulse" />
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center mb-6">
        <div className="h-9 w-full sm:max-w-xs rounded-md bg-slate-200 animate-pulse" />
        <div className="flex gap-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="h-8 w-20 rounded-md bg-slate-200 animate-pulse"
            />
          ))}
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="rounded-lg border border-slate-200 p-5 space-y-3 animate-pulse"
          >
            <div className="flex items-center justify-between">
              <div className="h-5 w-1/2 rounded bg-slate-200" />
              <div className="h-5 w-16 rounded-full bg-slate-200" />
            </div>
            <div className="h-4 w-3/4 rounded bg-slate-200" />
            <div className="grid grid-cols-3 gap-2 pt-2">
              {Array.from({ length: 3 }).map((_, j) => (
                <div key={j} className="h-12 rounded bg-slate-200" />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
