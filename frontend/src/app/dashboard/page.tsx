'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { getClients } from '@/lib/api';

type Client = {
  id: number;
  name: string;
  created_at: string;
  documents?: { id: number; file_name: string; file_type: string }[];
  latest_analysis?: {
    business_model?: string;
    industry?: string;
  } | null;
};

export default function DashboardPage() {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getClients()
      .then(({ clients: data }) => setClients(data || []))
      .catch((err) => setError(err instanceof Error ? err.message : 'Failed to load'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-emerald-50/30 dark:from-slate-950 dark:via-slate-900 dark:to-emerald-950/20">
      <header className="border-b border-slate-200/80 bg-white/80 backdrop-blur-sm dark:border-slate-800 dark:bg-slate-900/80">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
          <Link href="/" className="text-xl font-semibold tracking-tight text-slate-800 dark:text-slate-100">
            Smart Client Onboarding
          </Link>
          <nav className="flex gap-4">
            <Link
              href="/upload"
              className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-emerald-700"
            >
              Upload
            </Link>
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-12">
        <h1 className="mb-8 text-2xl font-bold text-slate-800 dark:text-slate-100">
          Clients
        </h1>

        {loading && (
          <div className="flex justify-center py-16">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-emerald-200 border-t-emerald-600" />
          </div>
        )}

        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-red-700 dark:border-red-800 dark:bg-red-950/30 dark:text-red-300">
            {error}
          </div>
        )}

        {!loading && !error && clients.length === 0 && (
          <div className="rounded-xl border border-slate-200 bg-white p-12 text-center dark:border-slate-700 dark:bg-slate-900">
            <p className="text-slate-600 dark:text-slate-400">No clients yet.</p>
            <Link href="/upload" className="mt-4 inline-block text-emerald-600 hover:underline">
              Upload your first client
            </Link>
          </div>
        )}

        {!loading && !error && clients.length > 0 && (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {clients.map((c) => (
              <Link
                key={c.id}
                href={`/dashboard/${c.id}`}
                className="block rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition hover:border-emerald-200 hover:shadow-md dark:border-slate-700 dark:bg-slate-900 dark:hover:border-emerald-800"
              >
                <h3 className="font-semibold text-slate-800 dark:text-slate-100">{c.name}</h3>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                  {c.documents?.length || 0} document(s)
                </p>
                {c.latest_analysis?.business_model && (
                  <p className="mt-2 text-xs text-emerald-600 dark:text-emerald-400">
                    {c.latest_analysis.business_model} • {c.latest_analysis.industry}
                  </p>
                )}
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
