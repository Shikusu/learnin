export default function Shell({ children }) {
  return (
    <div className="min-h-screen bg-(--bg) relative overflow-x-hidden">
      <div className="pointer-events-none fixed -top-40 -right-28 w-125 h-125 rounded-full bg-(--accent)/5 blur-[90px]" />
      <div className="pointer-events-none fixed bottom-20 -left-24 w-90 h-90 rounded-full bg-(--accent)/3 blur-[80px]" />
      <main className="relative z-1 max-w-xl mx-auto px-6 py-12">
        {children}
      </main>
    </div>
  );
}
