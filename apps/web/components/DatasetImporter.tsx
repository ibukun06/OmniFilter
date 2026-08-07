'use client';
import { ChangeEvent, useState } from 'react';
import { api } from '../lib/api';
function csv(text: string) {
  const lines = text.trim().split(/\r?\n/).filter(Boolean);
  const headers = lines.shift()?.split(',').map(x => x.trim()) || [];
  return lines.map(line => {
    const values = line.split(',').map(x => x.trim());
    return Object.fromEntries(headers.map((h, i) => [h, /^-?\d+(\.\d+)?$/.test(values[i]) ? Number(values[i]) : values[i] || '']));
  });
}
export default function DatasetImporter({ id, onDone }: { id: string; onDone: () => void }) {
  const [message, setMessage] = useState('');
  async function upload(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]; if (!file) return;
    try {
      const text = await file.text();
      const parsed = file.name.endsWith('.json') ? JSON.parse(text) : csv(text);
      const records = Array.isArray(parsed) ? parsed : [parsed];
      const result = await api(`/datasets/${id}/records`, { method: 'POST', body: JSON.stringify({ records }) });
      setMessage(`${result.imported} records imported`); onDone();
    } catch (error: any) { setMessage(error.message || 'Import failed'); }
  }
  return <div className="card"><h2>Import data</h2><p className="muted">Upload a flat CSV or a JSON array. Maximum 5,000 rows per request.</p><input type="file" accept=".csv,.json,application/json,text/csv" onChange={upload}/>{message && <p>{message}</p>}</div>;
}
