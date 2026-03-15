import Link from 'next/link';

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-br from-slate-50 via-white to-emerald-50/30 dark:from-slate-950 dark:via-slate-900 dark:to-emerald-950/20">
      <header className="border-b border-slate-200/80 bg-white/80 backdrop-blur-sm dark:border-slate-800 dark:bg-slate-900/80">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
          <h1 className="text-xl font-semibold tracking-tight text-slate-800 dark:text-slate-100">
            Smart Client Onboarding
          </h1>
          <nav className="flex gap-4">
            <Link
              href="/upload"
              className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-emerald-700"
            >
              Upload Files
            </Link>
            <Link
              href="/dashboard"
              className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-800"
            >
              Dashboard
            </Link>
          </nav>
        </div>
      </header>

      <main className="mx-auto flex max-w-4xl flex-1 flex-col items-center justify-center px-4 py-16">
        <h2 className="mb-4 text-center text-3xl font-bold tracking-tight text-slate-800 dark:text-slate-100">
          Automate client onboarding with AI
        </h2>
        <p className="mb-12 max-w-xl text-center text-slate-600 dark:text-slate-400">
          Upload business plans, goals, and voice notes. Our AI extracts insights and builds a structured dashboard for each client.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Link
            href="/upload"
            className="flex items-center gap-2 rounded-xl bg-emerald-600 px-6 py-4 text-base font-medium text-white shadow-lg shadow-emerald-500/25 transition hover:bg-emerald-700 hover:shadow-emerald-500/30"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
            </svg>
            Start Onboarding
          </Link>
          <Link
            href="/dashboard"
            className="flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-6 py-4 text-base font-medium text-slate-700 transition hover:bg-slate-50 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
          >
            View Clients
          </Link>
        </div>
      </main>
    </div>
  );
}
