import React, { useEffect, useState } from 'react';
import { Logs as LogsIcon, RefreshCw, Trash2 } from 'lucide-react';

const UserLogPage = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(null);

  const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:5001';
  const token = localStorage.getItem('token') || localStorage.getItem('jwt');

  async function fetchLogs() {
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE}/admin/logs`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      setLogs(data);
      setErr(null);
    } catch (e) {
      setErr(e.message);
    } finally {
      setLoading(false);
    }
  }

  async function deleteOne(id) {
    if (!confirm('Delete this log?')) return;
    try {
      const res = await fetch(`${API_BASE}/admin/logs/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      setLogs(prev => prev.filter(l => l.id !== id));
    } catch (e) {
      alert(`Delete failed: ${e.message}`);
    }
  }

  useEffect(() => { fetchLogs(); }, []);

  if (loading) return <div className="p-6">Loading user logs…</div>;
  if (err) return <div className="p-6 text-red-600">Error: {err}</div>;

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-semibold flex items-center gap-2">
          <LogsIcon className="w-5 h-5" />
          User Logs
        </h1>
        <button
          onClick={fetchLogs}
          className="px-3 py-1.5 rounded bg-gray-200 hover:bg-gray-300 flex items-center gap-1"
          title="Refresh"
        >
          <RefreshCw className="w-4 h-4" /> Refresh
        </button>
      </div>

      {logs.length === 0 ? (
        <div className="text-gray-500">No logs yet.</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full border text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="border px-3 py-2 text-left">User</th>
                <th className="border px-3 py-2 text-left">Role</th>
                <th className="border px-3 py-2 text-left">JWT token name</th>
                <th className="border px-3 py-2 text-left">IP</th>
                <th className="border px-3 py-2 text-left">Login time</th>
                <th className="border px-3 py-2 text-left">Logout time</th>
                <th className="border px-3 py-2"></th>
              </tr>
            </thead>
            <tbody>
              {logs.map((l) => (
                <tr key={l.id}>
                  <td className="border px-3 py-2">{l.userName || '—'}</td>
                  <td className="border px-3 py-2">{l.role || '—'}</td>
                  <td className="border px-3 py-2">{l.tokenName || '—'}</td>
                  <td className="border px-3 py-2">{l.ip || '—'}</td>
                  <td className="border px-3 py-2">
                    {l.loginAt ? new Date(l.loginAt).toLocaleString() : '—'}
                  </td>
                  <td className="border px-3 py-2">
                    {l.logoutAt ? (
                      new Date(l.logoutAt).toLocaleString()
                    ) : (
                      <span className="text-orange-600">active</span>
                    )}
                  </td>
                  <td className="border px-3 py-2 text-right">
                    <button
                      onClick={() => deleteOne(l.id)}
                      className="px-2 py-1 rounded bg-red-500 text-white hover:bg-red-600"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="text-xs text-gray-500 mt-2">{logs.length} log(s)</div>
        </div>
      )}
    </div>
  );
};

export default UserLogPage;
