import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Home.css';

const FEATURES = [
  { icon: '🔐', title: '3DS Authentication Flow', desc: 'Explore every step from merchant initiation to issuer authorization with animated diagrams.' },
  { icon: '⚡', title: 'Live Simulation', desc: 'Run frictionless and challenge 3DS flows in real-time with mock API responses.' },
  { icon: '🔒', title: 'Tokenization Deep-Dive', desc: 'Understand how PAN is converted to network tokens via PSP and card schemes.' },
  { icon: '⚖️', title: '3DS v1 vs v2 Comparison', desc: 'Side-by-side breakdown of legacy redirect flows versus modern 3DS2 risk-based auth.' },
  { icon: '📊', title: 'Transaction History', desc: 'Track all simulated transactions with status, ECI values, and step-by-step logs.' },
  { icon: '📄', title: 'Documentation', desc: 'Comprehensive 1-page explanation of 3DS, suitable for QA, developers, and analysts.' },
];

const FLOW_STAGES = [
  { step: '1', label: 'Payment Initiated', color: '#3B82F6', icon: '💳' },
  { step: '2', label: 'Tokenization', color: '#8B5CF6', icon: '🔐' },
  { step: '3', label: 'Authorization', color: '#06B6D4', icon: '📡' },
  { step: '4', label: '3DS Server', color: '#10B981', icon: '🛡️' },
  { step: '5', label: 'ACS Challenge', color: '#F59E0B', icon: '📱' },
  { step: '6', label: 'Settlement', color: '#EF4444', icon: '✅' },
];

export default function Home() {
  const { isAuthenticated } = useAuth();
  const flowRef = useRef(null);

  useEffect(() => {
    const items = flowRef.current?.querySelectorAll('.flow-stage');
    items?.forEach((el, i) => {
      el.style.animationDelay = `${i * 0.15}s`;
    });
  }, []);

  return (
    <div className="home page-enter">
      {/* ─── Hero ─────────────────────────────────────────────── */}
      <section className="hero section">
        <div className="container hero__inner">
          <div className="hero__badge">
            <span className="status-dot green" />
            <span>DatMan QA Assignment — Task 1</span>
          </div>

          <h1 className="hero__title">
            End-to-End <span className="gradient-text">3D Secure</span><br />
            Card Transaction Flow
          </h1>

          <p className="hero__subtitle">
            An interactive, enterprise-grade visualizer for the complete lifecycle of a 3DS-authenticated
            card payment — from frontend initiation to issuer settlement.
          </p>

          <div className="hero__cta">
            {isAuthenticated ? (
              <>
                <Link to="/flow" className="btn btn-primary btn-lg">
                  🔍 Explore Flow
                </Link>
                <Link to="/simulation" className="btn btn-secondary btn-lg">
                  ⚡ Run Simulation
                </Link>
              </>
            ) : (
              <>
                <Link to="/register" className="btn btn-primary btn-lg">
                  🚀 Get Started
                </Link>
                <Link to="/docs" className="btn btn-secondary btn-lg">
                  📄 Read Documentation
                </Link>
              </>
            )}
          </div>

          {/* Mini Flow Preview */}
          <div className="hero__flow" ref={flowRef}>
            {FLOW_STAGES.map((s, i) => (
              <div key={s.step} className="flow-stage">
                <div className="flow-stage__bubble" style={{ borderColor: s.color, boxShadow: `0 0 20px ${s.color}30` }}>
                  <span>{s.icon}</span>
                </div>
                <span className="flow-stage__label">{s.label}</span>
                {i < FLOW_STAGES.length - 1 && (
                  <div className="flow-stage__arrow" style={{ '--arrow-color': s.color }} />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Stats ────────────────────────────────────────────── */}
      <section className="stats-bar">
        <div className="container stats-bar__inner">
          <div className="stat-item">
            <span className="stat-item__value gradient-text">9</span>
            <span className="stat-item__label">Flow Stages</span>
          </div>
          <div className="stat-item">
            <span className="stat-item__value gradient-text">3DS 2.2</span>
            <span className="stat-item__label">Latest Standard</span>
          </div>
          <div className="stat-item">
            <span className="stat-item__value gradient-text">2</span>
            <span className="stat-item__label">Auth Flows</span>
          </div>
          <div className="stat-item">
            <span className="stat-item__value gradient-text">100%</span>
            <span className="stat-item__label">Interactive</span>
          </div>
        </div>
      </section>

      {/* ─── Features ─────────────────────────────────────────── */}
      <section className="section features">
        <div className="container">
          <div className="section-header">
            <h2>Everything You Need to Understand <span className="gradient-text">3DS</span></h2>
            <p className="section-subtitle">
              From theory to hands-on simulation — built for QA engineers, developers, and payment analysts.
            </p>
          </div>

          <div className="grid-3 features__grid">
            {FEATURES.map((f) => (
              <div key={f.title} className="glass-card feature-card">
                <div className="feature-card__icon">{f.icon}</div>
                <h3 className="feature-card__title">{f.title}</h3>
                <p className="feature-card__desc">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CTA Banner ───────────────────────────────────────── */}
      {!isAuthenticated && (
        <section className="section cta-banner">
          <div className="container">
            <div className="cta-banner__inner glass-card">
              <div className="cta-banner__content">
                <h2>Ready to Explore the Full Flow?</h2>
                <p>Create a free account to access the interactive flow explorer, live simulation, and transaction history.</p>
              </div>
              <div className="cta-banner__actions">
                <Link to="/register" className="btn btn-primary btn-lg">Create Free Account</Link>
                <Link to="/login" className="btn btn-ghost btn-lg">Sign In</Link>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ─── Footer ───────────────────────────────────────────── */}
      <footer className="footer">
        <div className="container footer__inner">
          <span className="footer__brand">⬡ <span className="gradient-text">3DS Visualizer</span></span>
          <span className="footer__copy">Built for DatMan QA Assignment — Task 1 | 3D Secure Card Transaction Flow</span>
        </div>
      </footer>
    </div>
  );
}
