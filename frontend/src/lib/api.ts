// Use same-origin /api (proxied to backend) to avoid CORS and connection issues
const API_BASE = process.env.NEXT_PUBLIC_API_URL || '';

function handleFetchError(err: unknown, fallback: string): never {
  const msg = err instanceof Error ? err.message : String(err);
  if (msg === 'Failed to fetch' || (err instanceof TypeError && msg.includes('fetch'))) {
    throw new Error('Backend not reachable. Start it: cd backend then npm run dev');
  }
  throw err instanceof Error ? err : new Error(fallback);
}

export async function uploadFiles(files: File[], clientName?: string) {
  const formData = new FormData();
  files.forEach((f) => formData.append('files', f));
  if (clientName) formData.append('clientName', clientName);

  let res: Response;
  try {
    res = await fetch(`${API_BASE}/api/upload`, {
      method: 'POST',
      body: formData,
    });
  } catch (err) {
    handleFetchError(err, 'Upload failed');
  }

  if (!res!.ok) {
    const err = await res!.json().catch(() => ({}));
    throw new Error(err.error || res!.statusText || 'Upload failed');
  }
  return res!.json();
}

export async function analyzeClient(clientId: number) {
  let res: Response;
  try {
    res = await fetch(`${API_BASE}/api/analyze/${clientId}`, { method: 'POST' });
  } catch (err) {
    handleFetchError(err, 'Analysis failed');
  }

  if (!res!.ok) {
    const err = await res!.json().catch(() => ({}));
    throw new Error(err.error || res!.statusText || 'Analysis failed');
  }
  return res!.json();
}

export async function getClient(clientId: number) {
  let res: Response;
  try {
    res = await fetch(`${API_BASE}/api/client/${clientId}`);
  } catch (err) {
    handleFetchError(err, 'Failed to fetch client');
  }

  if (!res!.ok) {
    const err = await res!.json().catch(() => ({}));
    throw new Error(err.error || res!.statusText || 'Failed to fetch client');
  }
  return res!.json();
}

export async function getClients() {
  let res: Response;
  try {
    res = await fetch(`${API_BASE}/api/clients`);
  } catch (err) {
    handleFetchError(err, 'Failed to fetch clients');
  }

  if (!res!.ok) {
    const err = await res!.json().catch(() => ({}));
    throw new Error(err.error || res!.statusText || 'Failed to fetch clients');
  }
  return res!.json();
}
