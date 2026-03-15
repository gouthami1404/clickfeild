'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { getClient } from '@/lib/api';

type Analysis = {
  business_model: string;
  industry: string;
  ideal_customer: string;
  goals: string;
  problems: string;
  opportunities: string;
};

type Document = {
  id: number;
  file_name: string;
  file_type: string;
  extracted_text: string;
  uploaded_at: string;
};

export default function ClientDashboardPage() {
  const params = useParams();
  const id = Number(params.id);
  const [data, setData] = useState<{
    client: { id: number; name: string; created_at: string };
    documents: Document[];
    analysis: Analysis | null;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getClient(id)
      .then(setData)
      .catch((err) => setError(err instanceof Error ? err.message : 'Failed to load'))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-emerald-200 border-t-emerald-600" />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center px-4">
        <p className="text-red-600 dark:text-red-400">{error || 'Client not found'}</p>
        <Link href="/dashboard" className="mt-4 text-emerald-600 hover:underline">
          Back to dashboard
        </Link>
      </div>
    );
  }

  const { client, documents, analysis } = data;

  const cards = analysis
    ? [
        { label: 'Business Model', value: analysis.business_model },
        { label: 'Industry', value: analysis.industry },
        { label: 'Ideal Customer', value: analysis.ideal_customer },
        { label: 'Goals', value: analysis.goals },
        { label: 'Problems', value: analysis.problems },
        { label: 'Opportunities', value: analysis.opportunities },
      ]
    : [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-emerald-50/30 dark:from-slate-950 dark:via-slate-900 dark:to-emerald-950/20">
      <header className="border-b border-slate-200/80 bg-white/80 backdrop-blur-sm dark:border-slate-800 dark:bg-slate-900/80">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
          <Link href="/" className="text-xl font-semibold tracking-tight text-slate-800 dark:text-slate-100">
            Smart Client Onboarding
          </Link>
          <nav className="flex gap-4">
            <Link href="/upload" className="text-sm font-medium text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100">
              Upload
            </Link>
            <Link href="/dashboard" className="text-sm font-medium text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100">
              Clients
            </Link>
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-12">
        <Link href="/dashboard" className="mb-6 inline-block text-sm text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100">
          ← Back to clients
        </Link>

        <div className="mb-10">
          <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100">{client.name}</h1>
          <p className="mt-1 text-slate-500 dark:text-slate-400">
            Onboarded {new Date(client.created_at).toLocaleDateString()}
          </p>
        </div>

        {documents.length > 0 && (
          <section className="mb-10">
            <h2 className="mb-4 text-lg font-semibold text-slate-800 dark:text-slate-100">
              Documents
            </h2>
            <div className="space-y-3">
              {documents.map((d) => (
                <div
                  key={d.id}
                  className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-900"
                >
                  <p className="font-medium text-slate-800 dark:text-slate-100">{d.file_name}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{d.file_type}</p>
                  {d.extracted_text && (
                    <p className="mt-2 line-clamp-3 text-sm text-slate-600 dark:text-slate-400">
                      {d.extracted_text}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        <section>
          <h2 className="mb-4 text-lg font-semibold text-slate-800 dark:text-slate-100">
            AI Analysis
          </h2>
          {cards.length > 0 ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {cards.map(({ label, value }) => (
                <div
                  key={label}
                  className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900"
                >
                  <h3 className="mb-2 text-sm font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
                    {label}
                  </h3>
                  <p className="text-slate-800 dark:text-slate-100">
                    {value || '—'}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-xl border border-slate-200 bg-white p-8 text-center dark:border-slate-700 dark:bg-slate-900">
              <p className="text-slate-500 dark:text-slate-400">No analysis available yet.</p>
              <p className="mt-1 text-sm text-slate-400 dark:text-slate-500">
                Upload documents and run analysis to see insights.
              </p>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
