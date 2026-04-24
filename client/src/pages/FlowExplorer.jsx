import { useState } from 'react';
import { FLOW_STAGES, FAILURE_EVENTS } from '../data/3ds-flow-data';
import './FlowExplorer.css';

export default function FlowExplorer() {
  const [activeStep, setActiveStep] = useState(0);
  const [activeTab, setActiveTab] = useState('description');
  const [flowPath, setFlowPath] = useState('frictionless'); // 'frictionless' | 'challenge'

  const visibleStages = FLOW_STAGES.filter(s => !s.path || s.path === flowPath);

  const stage = visibleStages[activeStep];

  return (
    <div className="flow-page page-enter section">
      <div className="container">
        {/* Header */}
        <div className="flow-header">
          <h1>Interactive <span className="gradient-text">3DS Flow</span> Explorer</h1>
          <p className="flow-header__sub">Click any stage to explore its details, payload, and risk implications.</p>

          {/* Flow Path Toggle */}
          <div className="flow-path-toggle">
            <button
              className={`path-btn ${flowPath === 'frictionless' ? 'path-btn--active path-btn--green' : ''}`}
              onClick={() => { setFlowPath('frictionless'); setActiveStep(0); }}
              id="btn-frictionless"
            >
              ✨ Frictionless Flow
            </button>
            <button
              className={`path-btn ${flowPath === 'challenge' ? 'path-btn--active path-btn--red' : ''}`}
              onClick={() => { setFlowPath('challenge'); setActiveStep(0); }}
              id="btn-challenge"
            >
              📱 Challenge Flow
            </button>
          </div>
        </div>

        <div className="flow-layout">
          {/* ─── Stage Timeline ──────────────────────── */}
          <div className="stage-timeline">
            {visibleStages.map((s, i) => (
              <button
                key={s.id}
                className={`stage-step ${i === activeStep ? 'stage-step--active' : ''} ${i < activeStep ? 'stage-step--done' : ''}`}
                onClick={() => setActiveStep(i)}
              >
                <div className="stage-step__num" style={i === activeStep ? { borderColor: s.color, boxShadow: `0 0 15px ${s.color}40` } : {}}>
                  {i < activeStep ? '✓' : i + 1}
                </div>
                <div className="stage-step__info">
                  <span className="stage-step__label">{s.stage}</span>
                  <span className="stage-step__actor">{s.actor.split('→')[0].trim()}</span>
                </div>
                {i < visibleStages.length - 1 && <div className="stage-step__connector" />}
              </button>
            ))}
          </div>

          {/* ─── Stage Detail Panel ──────────────────── */}
          <div className="stage-detail glass-card">
            <div className="stage-detail__header" style={{ borderLeftColor: stage.color }}>
              <span className="stage-detail__icon">{stage.icon}</span>
              <div>
                <h2 className="stage-detail__title">{stage.stage}</h2>
                <p className="stage-detail__actor">Actor: <strong>{stage.actor}</strong></p>
              </div>
              <div className="stage-detail__badge" style={{ background: `${stage.color}20`, color: stage.color }}>
                Step {activeStep + 1} / {visibleStages.length}
              </div>
            </div>

            {/* Tabs */}
            <div className="stage-tabs">
              {['description', 'payload', 'risk'].map(tab => (
                <button
                  key={tab}
                  className={`stage-tab ${activeTab === tab ? 'stage-tab--active' : ''}`}
                  onClick={() => setActiveTab(tab)}
                >
                  {tab === 'description' ? '📖 Description' : tab === 'payload' ? '📦 API Payload' : '⚠️ Risk Points'}
                </button>
              ))}
            </div>

            <div className="stage-content">
              {activeTab === 'description' && (
                <div className="tab-content page-enter">
                  <p className="stage-description">{stage.description}</p>
                  {stage.notes && (
                    <div className="stage-note">
                      <span className="stage-note__icon">💡</span>
                      <span>{stage.notes}</span>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'payload' && (
                <div className="tab-content page-enter">
                  <p className="tab-label">Sample {stage.actor.split('→')[0]} Payload:</p>
                  <pre className="code-block">{JSON.stringify(stage.payload, null, 2)}</pre>
                </div>
              )}

              {activeTab === 'risk' && (
                <div className="tab-content page-enter">
                  <p className="tab-label">QA Risk Points & Considerations:</p>
                  <ul className="risk-list">
                    {stage.riskPoints?.map((r, i) => (
                      <li key={i} className="risk-item">
                        <span className="risk-item__dot" />
                        {r}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Navigation */}
            <div className="stage-nav">
              <button className="btn btn-secondary btn-sm" onClick={() => setActiveStep(s => Math.max(0, s - 1))} disabled={activeStep === 0}>
                ← Previous
              </button>
              <div className="stage-dots">
                {visibleStages.map((_, i) => (
                  <span key={i} className={`stage-dot ${i === activeStep ? 'stage-dot--active' : ''}`} onClick={() => setActiveStep(i)} />
                ))}
              </div>
              <button className="btn btn-primary btn-sm" onClick={() => setActiveStep(s => Math.min(visibleStages.length - 1, s + 1))} disabled={activeStep === visibleStages.length - 1}>
                Next →
              </button>
            </div>
          </div>
        </div>

        {/* ─── Failure Events Section ──────────────────────────── */}
        <div className="failure-section">
          <h3>⚡ Failure Events & Error Handling</h3>
          <div className="grid-3">
            {FAILURE_EVENTS.map(f => (
              <div key={f.type} className="glass-card failure-card">
                <div className="failure-card__top">
                  <span className="badge badge-danger">{f.type}</span>
                  <span className="badge badge-info">ECI: {f.eci}</span>
                </div>
                <p className="failure-card__desc">{f.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// v2 - improved timeline UX