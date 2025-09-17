import './globals.css';

export const metadata = { title: 'Self-Manage', description: 'Habits & Tasks' };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja">
      <body className="min-h-screen bg-gray-50 text-gray-900">
        <header className="p-4 border-b bg-white">
          <div className="max-w-3xl mx-auto flex items-center justify-between">
            <h1 className="font-semibold">Self-Manage</h1>
            <nav className="text-sm space-x-4">
              <a href="/" className="hover:underline">Home</a>
              <a href="/tasks" className="hover:underline">Tasks</a>
              <a href="/habits" className="hover:underline">Habits</a>
            </nav>
          </div>
        </header>
        <main className="max-w-3xl mx-auto p-4">{children}</main>
      </body>
    </html>
  );
}

