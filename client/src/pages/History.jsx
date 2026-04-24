import { useState, useEffect } from 'react';
import api from '../utils/api';
import './History.css';

const STATUS_LABELS = { approved: 'badge-success', declined: 'badge-danger', pending: 'badge-warning', timeout: 'badge-warning', error: 'badge-danger' };

export default function History() {
  const [transactions, setTransactions] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [filter, setFilter] = useState({ status: '', authMethod: '' });

  const fetchData = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page, limit: 8, ...Object.fromEntries(Object.entries(filter).filter(([,v]) => v)) });
      const [txRes, statsRes] = await Promise.all([
        api.get(`/transactions?${params}`),
        api.get('/transactions/stats'),
      ]);
      setTransactions(txRes.data.transactions);
      setPages(txRes.data.pages);
      setStats(statsRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, [page, filter]);

  const deleteTransaction = async (id) => {
    if (!confirm('Delete this transaction?')) return;
    await api.delete(`/transactions/${id}`);
    fetchData();
  };

  return (
    <div className="history-page page-enter section">
      <div className="container">
        <h1>📊 Transaction <span className="gradient-text">History</span></h1>

        {/* Stats Row */}
        {stats && (
          <div className="grid-4 stats-row">
            {[
              { label: 'Total', value: stats.total, badge: 'badge-info' },
              { label: 'Approved', value: stats.approved, badge: 'badge-success' },
              { label: 'Declined', value: stats.declined, badge: 'badge-danger' },
              { label: 'Approval Rate', value: `${stats.approvalRate}%`, badge: 'badge-warning' },
            ].map(s => (
              <div key={s.label} className="glass-card stat-card">
                <span className="stat-card__val gradient-text">{s.value}</span>
                <span className="stat-card__label">{s.label}</span>
              </div>
            ))}
          </div>
        )}

        {/* Filters */}
        <div className="history-filters glass-card">
          <select className="form-input" value={filter.status} onChange={e => setFilter(f => ({ ...f, status: e.target.value }))}>
            <option value="">All Statuses</option>
            <option value="approved">Approved</option>
            <option value="declined">Declined</option>
            <option value="pending">Pending</option>
          </select>
          <select className="form-input" value={filter.authMethod} onChange={e => setFilter(f => ({ ...f, authMethod: e.target.value }))}>
            <option value="">All Auth Methods</option>
            <option value="3ds2_frictionless">Frictionless</option>
            <option value="3ds2_challenge">Challenge</option>
            <option value="3ds1_redirect">3DS1 Redirect</option>
          </select>
        </div>

        {/* Table */}
        <div className="glass-card history-table-wrap">
          {loading ? (
            <div className="history-loading"><span className="spinner" style={{ width: 32, height: 32 }} /></div>
          ) : transactions.length === 0 ? (
            <div className="history-empty">
              <span>🔍</span>
              <p>No transactions yet. <a href="/simulation">Run a simulation!</a></p>
            </div>
          ) : (
            <table className="data-table">
              <thead>
                <tr>
                  <th>Card</th>
                  <th>Amount</th>
                  <th>Auth Method</th>
                  <th>ECI</th>
                  <th>Risk Score</th>
                  <th>Status</th>
                  <th>Date</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {transactions.map(tx => (
                  <tr key={tx._id}>
                    <td><code>{tx.cardBrand} ****{tx.cardLast4}</code></td>
                    <td>${(tx.amount / 100).toFixed(2)}</td>
                    <td><span className="badge badge-purple" style={{ fontSize: '0.72rem' }}>{tx.authMethod}</span></td>
                    <td><code>{tx.eci || '—'}</code></td>
                    <td>
                      <span style={{ color: tx.riskScore < 30 ? 'var(--green)' : tx.riskScore < 70 ? 'var(--orange)' : 'var(--red)' }}>
                        {tx.riskScore ?? '—'}
                      </span>
                    </td>
                    <td><span className={`badge ${STATUS_LABELS[tx.status] || 'badge-info'}`}>{tx.status}</span></td>
                    <td style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                      {new Date(tx.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                    </td>
                    <td>
                      <button className="btn btn-danger btn-sm" onClick={() => deleteTransaction(tx._id)}>🗑️</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Pagination */}
        {pages > 1 && (
          <div className="history-pagination">
            <button className="btn btn-secondary btn-sm" onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}>← Prev</button>
            <span>Page {page} of {pages}</span>
            <button className="btn btn-secondary btn-sm" onClick={() => setPage(p => Math.min(pages, p + 1))} disabled={page === pages}>Next →</button>
          </div>
        )}
      </div>
    </div>
  );
}

// v2 - added pagination