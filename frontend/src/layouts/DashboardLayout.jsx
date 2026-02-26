 
 
 

export default function DashboardLayout({ children }) {
  return (
    <div className="min-h-screen">
      <main className="max-w-7xl mx-auto p-4 md:p-8 space-y-6">
        {children}
      </main>
    </div>
  )
}
