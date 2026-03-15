'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { FileDropzone } from '@/components/FileDropzone';
import { uploadFiles, analyzeClient } from '@/lib/api';

export default function UploadPage() {
  const router = useRouter();
  const [files, setFiles] = useState<File[]>([]);
  const [clientName, setClientName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [step, setStep] = useState<'upload' | 'processing'>('upload');

  const handleFilesAccepted = (accepted: File[]) => {
    setFiles((prev) => [...prev, ...accepted].slice(0, 10));
    setError(null);
  };

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    if (!files.length) {
      setError('Please add at least one file');
      return;
    }
    setError(null);
    setLoading(true);
    setStep('processing');
    try {
      const { client } = await uploadFiles(files, clientName || undefined);
      await analyzeClient(client.id);
      router.push(`/dashboard/${client.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
      setStep('upload');
    } finally {
      setLoading(false);
    }
  };

  if (step === 'processing') {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-slate-50 via-white to-emerald-50/30 px-4 dark:from-slate-950 dark:via-slate-900 dark:to-emerald-950/20">
        <div className="flex max-w-md flex-col items-center rounded-2xl border border-slate-200 bg-white p-12 shadow-xl dark:border-slate-700 dark:bg-slate-900">
          <div className="mb-6 h-14 w-14 animate-spin rounded-full border-4 border-emerald-200 border-t-emerald-600" />
          <h2 className="mb-2 text-xl font-semibold text-slate-800 dark:text-slate-100">
            Processing your files
          </h2>
          <p className="text-center text-slate-500 dark:text-slate-400">
            Extracting text and analyzing with AI. This may take a moment…
          </p>
          {error && (
            <p className="mt-4 text-sm text-red-600 dark:text-red-400">{error}</p>
          )}
        </div>
        <Link href="/upload" className="mt-6 text-sm text-emerald-600 hover:underline">
          Back to upload
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-emerald-50/30 dark:from-slate-950 dark:via-slate-900 dark:to-emerald-950/20">
      <header className="border-b border-slate-200/80 bg-white/80 backdrop-blur-sm dark:border-slate-800 dark:bg-slate-900/80">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
          <Link href="/" className="text-xl font-semibold tracking-tight text-slate-800 dark:text-slate-100">
            Smart Client Onboarding
          </Link>
          <nav className="flex gap-4">
            <Link href="/dashboard" className="text-sm font-medium text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100">
              Dashboard
            </Link>
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-2xl px-4 py-12">
        <h1 className="mb-2 text-2xl font-bold text-slate-800 dark:text-slate-100">
          Upload client files
        </h1>
        <p className="mb-8 text-slate-600 dark:text-slate-400">
          Add business plans, goals docs, or voice notes. PDF, DOCX, and audio supported.
        </p>

        <div className="mb-6">
          <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
            Client name (optional)
          </label>
          <input
            type="text"
            value={clientName}
            onChange={(e) => setClientName(e.target.value)}
            placeholder="e.g. Acme Corp"
            className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-slate-800 placeholder-slate-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 dark:placeholder-slate-500"
          />
        </div>

        <FileDropzone onFilesAccepted={handleFilesAccepted} disabled={loading} />

        {files.length > 0 && (
          <div className="mt-6 rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-900">
            <p className="mb-3 text-sm font-medium text-slate-700 dark:text-slate-300">
              Selected files ({files.length})
            </p>
            <ul className="space-y-2">
              {files.map((f, i) => (
                <li
                  key={`${f.name}-${i}`}
                  className="flex items-center justify-between rounded-lg bg-slate-50 px-3 py-2 dark:bg-slate-800"
                >
                  <span className="truncate text-sm text-slate-700 dark:text-slate-300">
                    {f.name}
                  </span>
                  <button
                    type="button"
                    onClick={() => removeFile(i)}
                    className="text-slate-400 hover:text-red-600"
                  >
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}

        {error && (
          <div className="mt-4 rounded-lg bg-red-50 p-4 text-sm text-red-700 dark:bg-red-950/50 dark:text-red-300">
            {error}
          </div>
        )}

        <button
          onClick={handleSubmit}
          disabled={loading || !files.length}
          className="mt-8 w-full rounded-xl bg-emerald-600 py-4 font-medium text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading ? 'Processing…' : 'Upload and analyze'}
        </button>
      </main>
    </div>
  );
}
