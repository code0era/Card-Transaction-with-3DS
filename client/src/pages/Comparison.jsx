import { COMPARISON_3DS } from '../data/3ds-flow-data';
import './Comparison.css';

export default function Comparison() {
  const rows = Object.keys(COMPARISON_3DS.v1.features);

  return (
    <div className="comp-page page-enter section">
      <div className="container">
        <div className="comp-header">
          <h1>⚖️ <span className="gradient-text">3DS v1</span> vs <span className="gradient-text">3DS v2</span></h1>
          <p>Side-by-side breakdown of the legacy redirect-based flow versus modern risk-based authentication.</p>
        </div>

        {/* Version Cards */}
        <div className="grid-2 comp-cards">
          {[COMPARISON_3DS.v1, COMPARISON_3DS.v2].map((v, i) => (
            <div key={v.name} className={`glass-card version-card ${i === 1 ? 'version-card--modern' : ''}`}>
              <div className="version-card__header">
                <span className="version-card__badge">{i === 0 ? '⚠️ Legacy' : '✅ Modern'}</span>
                <h2 className="version-card__name">{v.name}</h2>
                <span className="version-card__year">Released: {v.year}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Comparison Table */}
        <div className="glass-card comp-table-wrap">
          <table className="comp-table">
            <thead>
              <tr>
                <th>Feature</th>
                <th>3DS 1.0 <span className="badge badge-danger">Legacy</span></th>
                <th>3DS 2.x <span className="badge badge-success">Modern</span></th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, i) => (
                <tr key={row} className={i % 2 === 0 ? 'comp-row--even' : ''}>
                  <td className="comp-row__key">{row}</td>
                  <td className="comp-row__v1">{COMPARISON_3DS.v1.features[row]}</td>
                  <td className="comp-row__v2">{COMPARISON_3DS.v2.features[row]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Key Takeaways */}
        <div className="takeaways">
          <h3>📌 Key QA Takeaways</h3>
          <div className="grid-2">
            <div className="glass-card takeaway-card">
              <h4>Testing 3DS v1</h4>
              <ul>
                <li>Verify redirect URL is correct and returns properly</li>
                <li>Test popup blocker behavior on challenge window</li>
                <li>Validate POST-back from ACS to merchant return URL</li>
                <li>Check timeout handling (30 min default)</li>
              </ul>
            </div>
            <div className="glass-card takeaway-card takeaway-card--modern">
              <h4>Testing 3DS v2</h4>
              <ul>
                <li>Validate device fingerprint data collection</li>
                <li>Test frictionless vs. challenge flow switching</li>
                <li>Verify CAVV and ECI values in auth request</li>
                <li>Test 150+ data points submission completeness</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
