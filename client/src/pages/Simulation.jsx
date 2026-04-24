import { useState } from 'react';
import api from '../utils/api';
import './Simulation.css';

const CARD_BRANDS = ['Visa', 'Mastercard', 'Amex', 'Discover'];
const AUTH_METHODS = [
  { value: '3ds2_frictionless', label: '3DS2 Frictionless ✨', color: '#10B981' },
  { value: '3ds2_challenge', label: '3DS2 Challenge 📱', color: '#F59E0B' },
  { value: '3ds1_redirect', label: '3DS1 Redirect ↩', color: '#8B5CF6' },
];

export default function Simulation() {
  const [form, setForm] = useState({
    amount: 150,
    currency: 'USD',
    cardLast4: '4242',
    cardBrand: 'Visa',
    authMethod: '3ds2_frictionless',
    merchantName: 'DatMan Store',
  });
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [runningStep, setRunningStep] = useState(-1);

  const runSimulation = async () => {
    setLoading(true);
    setError('');
    setResult(null);
    setRunningStep(-1);

    try {
      // Animate through steps visually
      const stepCount = form.authMethod === '3ds2_frictionless' ? 9 : 11;
      for (let i = 0; i < stepCount; i++) {
        setRunningStep(i);
        await new Promise(r => setTimeout(r, 200 + Math.random() * 300));
      }

      const { data } = await api.post('/transactions/simulate', form);
      setResult(data);
      setRunningStep(-1);
    } catch (err) {
      setError(err.response?.data?.error || 'Simulation failed');
    } finally {
      setLoading(false);
      setRunningStep(-1);
    }
  };

  const STEP_LABELS = ['Payment Initiated', 'Tokenization', 'Authorization Req', '3DS Initiation', 'DS Lookup', 'ACS Risk Engine',
    ...(form.authMethod === '3ds2_challenge' ? ['Challenge Sent', 'Challenge Completed'] : []),
    'Auth Value Generated', 'Issuer Authorization', 'Settlement Complete'];

  return (
    <div className="sim-page page-enter section">
      <div className="container">
        <div className="sim-header">
          <h1>⚡ Live <span className="gradient-text">3DS Simulation</span></h1>
          <p>Configure a mock transaction and watch the 3DS flow execute in real-time.</p>
        </div>

        <div className="sim-layout">
          {/* Config Panel */}
          <div className="glass-card sim-config">
            <h3>Transaction Config</h3>
            <div className="divider" />

            <div className="form-group">
              <label className="form-label">Amount (cents)</label>
              <input type="number" className="form-input" value={form.amount}
                onChange={e => setForm(f => ({ ...f, amount: +e.target.value }))} min="1" max="999999" />
            </div>

            <div className="form-group">
              <label className="form-label">Card Last 4</label>
              <input type="text" className="form-input" value={form.cardLast4} maxLength={4}
                onChange={e => setForm(f => ({ ...f, cardLast4: e.target.value }))} placeholder="4242" />
            </div>

            <div className="form-group">
              <label className="form-label">Card Brand</label>
              <select className="form-input" value={form.cardBrand} onChange={e => setForm(f => ({ ...f, cardBrand: e.target.value }))}>
                {CARD_BRANDS.map(b => <option key={b}>{b}</option>)}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Authentication Method</label>
              {AUTH_METHODS.map(m => (
                <label key={m.value} className={`auth-method-option ${form.authMethod === m.value ? 'auth-method-option--active' : ''}`}
                  style={form.authMethod === m.value ? { borderColor: m.color } : {}}>
                  <input type="radio" name="authMethod" value={m.value} checked={form.authMethod === m.value}
                    onChange={e => setForm(f => ({ ...f, authMethod: e.target.value }))} />
                  <span style={form.authMethod === m.value ? { color: m.color } : {}}>{m.label}</span>
                </label>
              ))}
            </div>

            <button className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }}
              onClick={runSimulation} disabled={loading} id="run-simulation-btn">
              {loading ? <><span className="spinner" /> Running...</> : '▶ Run Simulation'}
            </button>
          </div>

          {/* Progress Panel */}
          <div className="sim-progress-panel">
            <div className="glass-card sim-progress">
              <h3>Flow Execution <span className={`badge ${loading ? 'badge-warning' : result ? 'badge-success' : 'badge-info'}`}>
                {loading ? 'Running' : result ? 'Complete' : 'Ready'}
              </span></h3>
              <div className="divider" />

              <div className="step-list">
                {STEP_LABELS.map((label, i) => (
                  <div key={i} className={`step-row ${runningStep === i ? 'step-row--active' : ''} ${(result && i < STEP_LABELS.length) ? 'step-row--done' : ''} ${runningStep > i ? 'step-row--done' : ''}`}>
                    <div className="step-row__indicator">
                      {runningStep > i || result ? <span className="step-check">✓</span>
                        : runningStep === i ? <span className="spinner" style={{ width: 14, height: 14 }} />
                        : <span className="step-num">{i + 1}</span>}
                    </div>
                    <span className="step-row__label">{label}</span>
                    {runningStep === i && <span className="step-row__pulse" />}
                  </div>
                ))}
              </div>
            </div>

            {/* Result Card */}
            {result && (
              <div className="glass-card sim-result page-enter">
                <div className="sim-result__header">
                  <span className="sim-result__check">✅</span>
                  <div>
                    <h3>Simulation Complete</h3>
                    <p>{result.message}</p>
                  </div>
                </div>
                <div className="sim-result__grid">
                  <div className="result-item"><span>Transaction ID</span><code>{result.transaction._id?.slice(-8)}</code></div>
                  <div className="result-item"><span>Status</span><span className="badge badge-success">{result.transaction.status}</span></div>
                  <div className="result-item"><span>Auth Method</span><span className="badge badge-purple">{result.transaction.authMethod}</span></div>
                  <div className="result-item"><span>ECI</span><code>{result.transaction.eci}</code></div>
                  <div className="result-item"><span>Risk Score</span><span style={{ color: result.transaction.riskScore < 30 ? 'var(--green)' : 'var(--orange)' }}>{result.transaction.riskScore}</span></div>
                  <div className="result-item"><span>Steps Logged</span><code>{result.transaction.steps?.length}</code></div>
                </div>
              </div>
            )}

            {error && <div className="alert alert-error">{error}</div>}
          </div>
        </div>
      </div>
    </div>
  );
}

// v2 - improved animation timing