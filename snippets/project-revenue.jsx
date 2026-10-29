export const ProjectRevenue = () => {
  const [volume, setVolume] = useState(1000000);
  const [rate, setRate] = useState(1);
  const [cancellationFees, setCancellationFees] = useState(0);
  const [model, setModel] = useState('read');
  const valid = volume !== '' && rate !== '' && Number.isFinite(Number(volume)) && Number.isFinite(Number(rate)) && Number(volume) >= 0 && Number(volume) <= 100000000 && Number(rate) >= 0 && Number(rate) <= 100 && cancellationFees !== '' && Number.isFinite(Number(cancellationFees)) && Number(cancellationFees) >= 0 && Number(cancellationFees) <= 100000000;
  const tradeFees = valid ? Number(volume) * Number(rate) / 100 : 0;
  const fees = valid ? tradeFees + Number(cancellationFees) : 0;
  const share = model === 'write' ? 0.5 : 0.3;
  const money = (value) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 2 }).format(value);
  const inputStyle = { display: 'block', width: '100%', padding: '10px 12px', marginTop: 6, border: '1px solid #80808080', borderRadius: 8, background: 'transparent', color: 'inherit' };
  return (
    <section className="not-prose my-6" aria-label="Project revenue calculator">
      <h3 style={{ fontWeight: 700, fontSize: 20 }}>1. Set your assumptions</h3>
      <p style={{ fontSize: 14, margin: '8px 0 20px' }}>Illustrative calculator. The 1% starting fee is an assumption, not a confirmed Checkpoint fee.</p>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 20 }}>
        <div>
          <label htmlFor="project-volume" style={{ fontWeight: 600 }}>Fee-bearing trade volume (USD)</label>
          <input id="project-volume" type="number" min="0" max="100000000" step="any" value={volume} onChange={(event) => setVolume(event.target.value)} style={inputStyle} aria-describedby="project-volume-help" />
          <input aria-label="Fee-bearing trade volume slider" type="range" min="0" max="100000000" step="100000" value={Math.max(0, Math.min(100000000, Number(volume) || 0))} onChange={(event) => setVolume(Number(event.target.value))} style={{ width: '100%', marginTop: 12, accentColor: '#32cdcd' }} />
          <div id="project-volume-help" style={{ fontSize: 12 }}>From $0 to $100 million. Enter an exact amount above.</div>
        </div>
        <div>
          <label htmlFor="project-rate" style={{ fontWeight: 600 }}>Assumed trade fee (%)</label>
          <input id="project-rate" type="number" min="0" max="100" step="any" value={rate} onChange={(event) => setRate(event.target.value)} style={inputStyle} />
          <label htmlFor="project-cancellation-fees" style={{ display: 'block', marginTop: 14, fontWeight: 600 }}>Cancellation fees collected (USDC)</label>
          <input id="project-cancellation-fees" type="number" min="0" max="100000000" step="any" value={cancellationFees} onChange={(event) => setCancellationFees(event.target.value)} style={inputStyle} aria-describedby="project-cancellation-help" />
          <div id="project-cancellation-help" style={{ fontSize: 12, marginTop: 6 }}>Enter collected fees, not cancelled offer volume.</div>
          <label htmlFor="project-model" style={{ display: 'block', marginTop: 14, fontWeight: 600 }}>Settlement type</label>
          <select id="project-model" value={model} onChange={(event) => setModel(event.target.value)} style={inputStyle}>
            <option value="read" style={{ color: '#18181b', background: '#fff' }}>Seller settlement — 30% project share</option>
            <option value="write" style={{ color: '#18181b', background: '#fff' }}>Oracle escrow settlement — 50% project share</option>
          </select>
        </div>
      </div>
      <div aria-live="polite" aria-atomic="true" style={{ marginTop: 32 }}>
        {!valid ? <p role="alert">Enter volume and collected cancellation fees between 0 and 100 million, and a trade fee rate between 0% and 100%.</p> : (
          <div>
            <section aria-label="Your project revenue" style={{ borderTop: '1px solid #80808050', paddingTop: 24 }}>
            <h3 style={{ fontWeight: 700, fontSize: 20 }}>2. Your project's revenue</h3>
            <div style={{ fontSize: 36, fontWeight: 700, margin: '12px 0 4px' }}>{money(fees * share)}</div>
            <p style={{ fontSize: 13, marginBottom: 8 }}>Trade / settlement fees: {money(tradeFees)} · Cancellation fees: {money(Number(cancellationFees))}</p>
            <p style={{ fontSize: 14, marginBottom: 20 }}>{share * 100}% of eligible fees under the {model === 'write' ? 'oracle escrow' : 'seller settlement'} model.</p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 16 }}>
              {[
                ['Total eligible fees', fees],
                ['Checkpoint', fees * (1 - share)],
              ].map(([label, value]) => (
                <div key={label}>
                  <div style={{ fontSize: 13 }}>{label}</div>
                  <div style={{ fontSize: 24, fontWeight: 700 }}>{money(value)}</div>
                </div>
              ))}
            </div>
            <div role="img" aria-label={`Fee split: your project ${share * 100} percent, Checkpoint ${100 - share * 100} percent. Total fees ${money(fees)}.`} style={{ display: 'flex', height: 42, borderRadius: 8, overflow: 'hidden', marginTop: 20, opacity: fees === 0 ? 0.5 : 1 }}>
              <div style={{ width: `${share * 100}%`, background: '#32cdcd', color: '#102525', display: 'grid', placeItems: 'center', fontWeight: 700 }}>{share * 100}%</div>
              <div style={{ width: `${100 - share * 100}%`, background: '#64748b', color: '#fff', display: 'grid', placeItems: 'center', fontWeight: 700 }}>{100 - share * 100}%</div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginTop: 6 }}><span>Your project</span><span>Checkpoint</span></div>
            </section>
            <section aria-label="Model comparison" style={{ borderTop: '1px solid #80808050', paddingTop: 24, marginTop: 32 }}>
              <h3 style={{ fontWeight: 700, fontSize: 20 }}>3. Compare the models</h3>
              <p style={{ fontSize: 14, margin: '8px 0 20px' }}>Your project's revenue at the same volume and fee rate.</p>
              {[
                ['Seller settlement', 0.3],
                ['Oracle escrow settlement', 0.5],
              ].map(([label, fraction]) => (
                <div key={label} style={{ marginBottom: 20 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap', fontSize: 14, marginBottom: 8 }}>
                    <span>{label} · {fraction * 100}% share</span><strong>{money(fees * fraction)}</strong>
                  </div>
                  <div aria-hidden="true" style={{ height: 20, borderRadius: 5, background: '#80808020', overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: fees === 0 ? '0%' : `${fraction / 0.5 * 100}%`, background: fraction === 0.5 ? '#32cdcd' : '#64748b' }} />
                  </div>
                </div>
              ))}
              <p style={{ fontSize: 13 }}>Oracle escrow settlement represents {money(fees * 0.2)} more for your project in this scenario, with responsibility for escrow recognition and allocation delivery.</p>
            </section>
          </div>
        )}
      </div>
      <p style={{ fontSize: 12, marginTop: 18 }}>Calculation: (fee-bearing trade volume × assumed trade fee rate + collected cancellation fees) × project share. Use only volume on which the trade fee is collected. Excludes fillExtra, deposit fees, secondary-market fees and per-transaction rounding. Estimates remain subject to the final fee policy, settlement and payout conditions.</p>
    </section>
  );
};
