'use client'

export default function UserManagementLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex flex-col h-full">
      <header className="bg-background border-b px-6 py-4">
        <h1 className="text-2xl font-bold tracking-tight">User Management</h1>
      </header>
      <main className="flex-1 overflow-y-auto p-6">
        {children}
      </main>
    </div>
  )
}
