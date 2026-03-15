'use client';

import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';

const ACCEPT = {
  'application/pdf': ['.pdf'],
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
  'audio/mpeg': ['.mp3'],
  'audio/mp3': ['.mp3'],
  'audio/wav': ['.wav'],
  'audio/webm': ['.webm'],
};

const MAX_SIZE = 10 * 1024 * 1024;

type Props = {
  onFilesAccepted: (files: File[]) => void;
  disabled?: boolean;
};

export function FileDropzone({ onFilesAccepted, disabled }: Props) {
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles.length) onFilesAccepted(acceptedFiles);
    },
    [onFilesAccepted]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: ACCEPT,
    maxSize: MAX_SIZE,
    maxFiles: 10,
    disabled,
  });

  return (
    <div
      {...getRootProps()}
      className={`
        flex min-h-[240px] cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed
        px-6 py-12 transition-colors
        ${
          isDragActive
            ? 'border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/20'
            : 'border-slate-300 bg-slate-50/50 hover:border-slate-400 dark:border-slate-600 dark:bg-slate-900/30 dark:hover:border-slate-500'
        }
        ${disabled ? 'cursor-not-allowed opacity-60' : ''}
      `}
    >
      <input {...getInputProps()} />
      <svg
        className="mb-4 h-14 w-14 text-slate-400 dark:text-slate-500"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
        />
      </svg>
      <p className="mb-1 text-center text-sm font-medium text-slate-700 dark:text-slate-300">
        {isDragActive ? 'Drop files here' : 'Drag & drop files here'}
      </p>
      <p className="text-center text-xs text-slate-500 dark:text-slate-400">
        PDF, DOCX, MP3, WAV • Max 10MB per file • Up to 10 files
      </p>
    </div>
  );
}
