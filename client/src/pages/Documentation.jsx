import './Documentation.css';

export default function Documentation() {
  return (
    <div className="docs-page page-enter section">
      <div className="container">
        <div className="docs-header">
          <span className="badge badge-info">Task 1 — Official Deliverable</span>
          <h1>End-to-End Lifecycle of a <span className="gradient-text">3D Secure Card Transaction</span></h1>
          <p className="docs-meta">Author: QA Assignment Submission | Standard: EMVCo 3DS 2.2 | Date: April 2024</p>
        </div>

        <div className="docs-content">
          <section className="doc-section">
            <h2>1. Overview</h2>
            <p>3D Secure (3DS) is a fraud prevention protocol designed to add an authentication step to online card-not-present (CNP) transactions. The cardholder's identity is verified by the card issuer before the transaction is authorized, providing a cryptographic proof (CAVV) that shifts chargeback liability from the merchant to the issuing bank.</p>
            <p>3DS 2.x (EMVCo specification) replaces the legacy redirect-based 3DS 1.0 with a risk-based authentication system that analyzes 150+ data points to allow the majority of transactions to pass frictionlessly (no OTP required).</p>
          </section>

          <section className="doc-section">
            <h2>2. Key Actors</h2>
            <div className="actors-grid">
              {[
                { role: 'Cardholder', desc: 'The individual making the payment on the merchant website or app.' },
                { role: 'Merchant', desc: 'The e-commerce business collecting the payment. Integrates PSP SDK.' },
                { role: 'PSP (Payment Service Provider)', desc: 'Handles tokenization and routes the transaction. Examples: Stripe, Adyen, Braintree.' },
                { role: 'Acquiring Bank', desc: 'The merchant\'s bank. Receives authorization requests and routes them.' },
                { role: 'Card Network (Scheme)', desc: 'Visa, Mastercard, Amex. Routes messages between banks and hosts the Directory Server (DS).' },
                { role: 'Issuing Bank', desc: 'The cardholder\'s bank. Hosts the Access Control Server (ACS) and makes the final auth decision.' },
                { role: '3DS Server', desc: 'Merchant-side component that initiates 3DS authentication and communicates with the DS.' },
                { role: 'ACS (Access Control Server)', desc: 'Issuer-hosted service that performs risk assessment and authenticates the cardholder.' },
              ].map(a => (
                <div key={a.role} className="actor-card glass-card">
                  <span className="actor-card__role">{a.role}</span>
                  <span className="actor-card__desc">{a.desc}</span>
                </div>
              ))}
            </div>
          </section>

          <section className="doc-section">
            <h2>3. End-to-End Flow</h2>
            <div className="flow-steps-doc">
              {[
                { n: 1, title: 'Frontend Initiation (Merchant Site)', detail: 'Cardholder completes checkout. The merchant\'s frontend uses a PSP-provided JavaScript SDK (Stripe.js, Adyen.js) which renders card fields in a PCI-DSS compliant iframe, preventing raw card data from touching merchant servers.' },
                { n: 2, title: 'Tokenization', detail: 'The PSP SDK collects card data and replaces the PAN (Primary Account Number) with a payment token — either a PSP-specific token or an EMV network token via Visa Token Service (VTS) or Mastercard Digital Enablement Service (MDES). The token is returned to the merchant frontend.' },
                { n: 3, title: '3DS Initiation', detail: 'The merchant\'s 3DS Server sends an Authentication Request (AReq) to the Card Network\'s Directory Server (DS). The DS verifies the card BIN is enrolled in 3DS and returns the issuer\'s ACS URL.' },
                { n: 4, title: 'Device Data Collection', detail: 'The 3DS method URL (from ACS) is silently loaded in an iframe to collect device fingerprint data. This data (device type, browser capabilities, IP, timezone, screen resolution, OS, etc.) is posted to the ACS.' },
                { n: 5, title: 'Risk Assessment (ACS)', detail: 'The issuer\'s ACS risk engine processes 150+ data points including device fingerprint, transaction history, behavioral biometrics, geo-IP, and velocity data. Based on risk score: Score < 30 → Frictionless, Score 30–70 → Challenge, Score > 70 → Decline.' },
                { n: 6, title: 'Frictionless Path', detail: 'If risk is low, the ACS authenticates without any user interaction. An Authentication Response (ARes) is returned immediately with transStatus=Y, along with a CAVV (Cardholder Authentication Verification Value) and ECI=07.' },
                { n: 7, title: 'Challenge Path (if needed)', detail: 'If risk is elevated, the ACS initiates a challenge. The cardholder is presented with: OTP via SMS/email, Biometric prompt (fingerprint/face on mobile), OOB (Out-of-Band) push notification. On successful challenge completion, the ACS generates the CAVV with ECI=05.' },
                { n: 8, title: 'Authorization', detail: 'The final authorization message (ISO 8583, 0100) includes the CAVV, ECI, and DS Transaction ID. The Issuer validates the CAVV cryptographically (via HSM) and returns an approval (response code 00) or decline.' },
                { n: 9, title: 'Settlement', detail: 'On T+1, the acquiring bank submits cleared transactions in a batch to the card network. Funds are transferred from the issuing bank to the acquiring bank, then to the merchant\'s account.' },
              ].map(s => (
                <div key={s.n} className="flow-step-doc">
                  <div className="flow-step-doc__num gradient-text">{s.n}</div>
                  <div className="flow-step-doc__body">
                    <h4>{s.title}</h4>
                    <p>{s.detail}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="doc-section">
            <h2>4. Success & Failure Events</h2>
            <table className="data-table">
              <thead>
                <tr><th>Event</th><th>ECI</th><th>transStatus</th><th>Liability</th><th>Action</th></tr>
              </thead>
              <tbody>
                <tr><td>Fully Authenticated (Challenge)</td><td>05</td><td>Y</td><td>Issuer</td><td>Proceed with authorization</td></tr>
                <tr><td>Frictionless Authenticated</td><td>07</td><td>Y</td><td>Issuer</td><td>Proceed with authorization</td></tr>
                <tr><td>Attempted Authentication</td><td>06</td><td>A</td><td>Issuer (partial)</td><td>Proceed at merchant risk</td></tr>
                <tr><td>Not Authenticated</td><td>07</td><td>N</td><td>Merchant</td><td>Decline transaction</td></tr>
                <tr><td>Cardholder Not Enrolled</td><td>07</td><td>—</td><td>Merchant</td><td>Proceed without 3DS</td></tr>
                <tr><td>Issuer/ACS Unavailable</td><td>07</td><td>U</td><td>Merchant</td><td>Optional: proceed at risk</td></tr>
                <tr><td>Challenge Timed Out</td><td>07</td><td>N</td><td>Merchant</td><td>Decline or retry</td></tr>
              </tbody>
            </table>
          </section>

          <section className="doc-section">
            <h2>5. Security Highlights</h2>
            <ul className="doc-bullets">
              <li><strong>CAVV (Cardholder Authentication Verification Value):</strong> A cryptographic MAC generated by the ACS using HSM-secured keys, proving authentication occurred.</li>
              <li><strong>Liability Shift:</strong> Successful 3DS authentication transfers chargeback liability from the merchant to the issuing bank for fraud-related disputes.</li>
              <li><strong>EMV 3DS Data:</strong> 3DS2 sends 150+ data elements vs. ~15 in 3DS1, dramatically improving risk assessment accuracy.</li>
              <li><strong>Decoupled Authentication:</strong> 3DS2.2 supports authenticating the cardholder asynchronously (e.g., banking app approval) before checkout.</li>
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
}
