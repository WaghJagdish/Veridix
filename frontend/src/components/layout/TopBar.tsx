export function TopBar() {
  return (
    <header className="flex h-16 items-center justify-between border-b bg-background px-6">
      <div className="flex items-center gap-4">
        {/* Breadcrumbs could go here */}
      </div>
      <div className="flex items-center gap-4">
        <div className="h-8 w-8 rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center text-sm font-medium">
          A
        </div>
      </div>
    </header>
  )
}
