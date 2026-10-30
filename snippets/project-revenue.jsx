export const ProjectRevenue = () => {
  const [volume, setVolume] = useState(1000000);
  const [rate, setRate] = useState(1);
  const [cancellationFees, setCancellationFees] = useState(0);
  const [model, setModel] = useState('read');
  const valid = volume !== '' && rate !== '' && Number.isFinite(Number(volume)) && Number.isFinite(Number(rate)) && Number(volume) >= 0 && Number(rate) >= 0 && Number(rate) <= 100 && cancellationFees !== '' && Number.isFinite(Number(cancellationFees)) && Number(cancellationFees) >= 0;
  const tradeFees = valid ? Number(volume) * Number(rate) / 100 : 0;
  const fees = valid ? tradeFees + Number(cancellationFees) : 0;
  const share = model === 'write' ? 0.5 : 0.3;
  const chartPoints = (Number(volume) > 0 ? [0.25, 0.5, 0.75, 1] : [1]).map((fraction) => {
    const tradingRevenue = tradeFees * share * fraction;
    const cancellationRevenue = Number(cancellationFees) * share;
    return { fraction, volume: Number(volume) * fraction, tradingRevenue, cancellationRevenue, total: tradingRevenue + cancellationRevenue };
  });
  const money = (value) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 2 }).format(value);
  const compactMoney = (value) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', notation: 'compact', maximumFractionDigits: 2 }).format(value);
  const formatInput = (value) => {
    if (value === '') return '';
    const [whole, fraction] = String(value).split('.');
    const grouped = (whole || '0').replace(/^0+(?=\d)/, '').replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    return '$' + grouped + (fraction === undefined ? '' : '.' + fraction);
  };
  const updateAmount = (event, setter) => {
    const amount = event.target.value.replace(/[$,\s]/g, '');
    if (/^\d*(\.\d{0,6})?$/.test(amount)) setter(amount);
  };
  const inputStyle = { display: 'block', width: '100%', padding: '10px 12px', marginTop: 6, border: '1px solid #80808080', borderRadius: 8, background: 'transparent', color: 'inherit' };
  return (
    <section className="not-prose my-6" aria-label="Project fees calculator">
      <h3 style={{ fontWeight: 700, fontSize: 20 }}>1. Set your assumptions</h3>
      <p style={{ fontSize: 14, margin: '8px 0 20px' }}>Illustrative calculator.</p>
      <div style={{ display: 'grid', gap: 24 }}>
        <div>
          <label htmlFor="project-volume" style={{ fontWeight: 600 }}>Fee-bearing trade volume (USD)</label>
          <input id="project-volume" type="text" inputMode="decimal" placeholder="$0" value={formatInput(volume)} onChange={(event) => updateAmount(event, setVolume)} style={inputStyle} aria-describedby="project-volume-help" />
          <input aria-label="Fee-bearing trade volume slider" type="range" min="0" max="100000000" step="100000" value={Math.max(0, Math.min(100000000, Number(volume) || 0))} onChange={(event) => setVolume(Number(event.target.value))} style={{ width: '100%', marginTop: 12, accentColor: '#32cdcd' }} />
          <div id="project-volume-help" style={{ fontSize: 12 }}>Slider: $0–$100 million. Enter larger amounts directly.</div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(220px, 100%), 1fr))', gap: 20 }}>
          <div>
            <label htmlFor="project-rate" style={{ fontWeight: 600 }}>Assumed trade fee (%)</label>
            <input id="project-rate" type="number" min="0" max="100" step="any" value={rate} onChange={(event) => setRate(event.target.value)} style={inputStyle} />
          </div>
          <div>
            <label htmlFor="project-cancellation-fees" style={{ fontWeight: 600 }}>Cancellation fees collected (USD)</label>
            <input id="project-cancellation-fees" type="text" inputMode="decimal" placeholder="$0" value={formatInput(cancellationFees)} onChange={(event) => updateAmount(event, setCancellationFees)} style={inputStyle} aria-describedby="project-cancellation-help" />
            <div id="project-cancellation-help" style={{ fontSize: 12, marginTop: 6 }}>Enter collected fees, not cancelled offer volume.</div>
          </div>
        </div>
        <fieldset style={{ margin: 0, padding: 0, border: 0, minWidth: 0 }}>
          <legend style={{ fontWeight: 600, marginBottom: 10 }}>Settlement type</legend>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(220px, 100%), 1fr))', gap: 16 }}>
            {[
              ['read', 'Seller settlement', 30],
              ['write', 'Oracle escrow settlement', 50],
            ].map(([value, label, percentage]) => (
              <label className="cp-settlement-option" data-selected={model === value ? 'true' : 'false'} key={value}>
                <input type="radio" name="project-settlement-type" value={value} checked={model === value} onChange={() => setModel(value)} style={{ accentColor: '#32cdcd', width: 18, height: 18, margin: 0, flexShrink: 0 }} />
                <span style={{ minWidth: 0 }}>
                  <span style={{ display: 'block', fontWeight: 600, lineHeight: 1.4 }}>{label}</span>
                  <span style={{ display: 'block', fontSize: 13, marginTop: 4 }}>{percentage}% project fee share</span>
                </span>
              </label>
            ))}
          </div>
        </fieldset>
      </div>
      <div aria-live="polite" aria-atomic="true" style={{ marginTop: 32 }}>
        {!valid ? <p role="alert">Enter non-negative volume and cancellation fees, and a trade fee rate between 0% and 100%.</p> : (
          <div>
            <section aria-label="Your project fees" style={{ borderTop: '1px solid #80808050', paddingTop: 24 }}>
              <h3 style={{ fontWeight: 700, fontSize: 20 }}>2. Your project's fees</h3>
              <div style={{ display: 'block', fontSize: 14, marginTop: 12 }}>{model === 'write' ? 'Oracle escrow settlement' : 'Seller settlement'} · {share * 100}% project fee share</div>
              <div style={{ fontSize: 40, fontWeight: 700, margin: '12px 0 24px', overflowWrap: 'anywhere' }}>{money(fees * share)}</div>
              {fees > 0 ? (
                <div role="group" aria-label="Project fees by trade volume">
                  <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 12 }}>Project fees</div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px 20px', fontSize: 12, marginBottom: 12 }}>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                      <span aria-hidden="true" style={{ width: 10, height: 10, borderRadius: 2, background: '#32cdcd' }} />Trading fees
                    </span>
                    {Number(cancellationFees) > 0 && <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                      <span aria-hidden="true" style={{ width: 10, height: 10, borderRadius: 2, background: '#64748b' }} />Cancellation fees
                    </span>}
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: `repeat(${chartPoints.length}, minmax(0, 1fr))`, gap: 12 }}>
                    {chartPoints.map((point) => (
                      <div className="cp-volume-point" role="group" tabIndex={0} aria-label={`${money(point.volume)} trading volume: ${money(point.total)} project fees, including ${money(point.tradingRevenue)} from trading fees and ${money(point.cancellationRevenue)} from cancellation fees${point.fraction === 1 ? '. Your scenario' : ''}`} aria-describedby={`project-chart-detail-${point.fraction * 100}`} key={point.fraction}>
                        <div className="cp-volume-tooltip" role="tooltip" id={`project-chart-detail-${point.fraction * 100}`}>
                          <div className="cp-chart-tooltip-row"><span>Volume</span><strong>{money(point.volume)}</strong></div>
                          <div className="cp-chart-tooltip-row"><span>Trading</span><strong>{money(point.tradingRevenue)}</strong></div>
                          {point.cancellationRevenue > 0 && <div className="cp-chart-tooltip-row"><span>Cancellation</span><strong>{money(point.cancellationRevenue)}</strong></div>}
                          <div className="cp-chart-tooltip-row cp-chart-tooltip-total"><span>Your fees</span><strong>{money(point.total)}</strong></div>
                        </div>
                        <div style={{ height: 170, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', alignItems: 'center', borderBottom: '1px solid #80808050' }}>
                          <div style={{ fontSize: 13, fontWeight: point.fraction === 1 ? 700 : 500, marginBottom: 8 }}>{compactMoney(point.total)}</div>
                          <div aria-hidden="true" data-chart-stack="true" style={{ display: 'flex', flexDirection: 'column', width: '70%', maxWidth: 80, height: point.total / (fees * share) * 120, borderRadius: '6px 6px 0 0', overflow: 'hidden', opacity: point.fraction === 1 ? 1 : 0.65 }}>
                            <div data-fees-source="trading" style={{ height: point.total > 0 ? `${point.tradingRevenue / point.total * 100}%` : '0%', background: '#32cdcd' }} />
                            <div data-fees-source="cancellation" style={{ height: point.total > 0 ? `${point.cancellationRevenue / point.total * 100}%` : '0%', background: '#64748b' }} />
                          </div>
                        </div>
                        <div style={{ fontSize: 12, marginTop: 10, fontWeight: point.fraction === 1 ? 700 : 400 }}>{compactMoney(point.volume)}</div>
                        <div style={{ minHeight: 32, paddingTop: 6 }}>
                          {point.fraction === 1 && <span style={{ display: 'inline-block', fontSize: 11, lineHeight: 1.4, padding: '3px 6px', borderRadius: 5, background: 'rgb(50 205 205 / 12%)' }}>Your scenario</span>}
                        </div>
                      </div>
                    ))}
                  </div>
                  <div style={{ fontSize: 13, textAlign: 'center', marginTop: 6 }}>Trading volume</div>
                  {Number(cancellationFees) > 0 && <div style={{ fontSize: 12, marginTop: 12 }}>The entered cancellation fees stay constant across volume examples.</div>}
                </div>
              ) : (
                <div style={{ padding: '20px 0', fontSize: 14 }}>Project fees is $0 for these inputs.</div>
              )}
              {Number(cancellationFees) > 0 && (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(200px, 100%), 1fr))', gap: 20, marginTop: 24 }}>
                  <div>
                    <div style={{ fontSize: 14 }}>From trading fees</div>
                    <div style={{ fontSize: 24, fontWeight: 600, marginTop: 6, overflowWrap: 'anywhere' }}>{money(tradeFees * share)}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: 14 }}>From cancellation fees</div>
                    <div style={{ fontSize: 24, fontWeight: 600, marginTop: 6, overflowWrap: 'anywhere' }}>{money(Number(cancellationFees) * share)}</div>
                  </div>
                </div>
              )}
            </section>
            <section aria-label="Model comparison" style={{ borderTop: '1px solid #80808050', paddingTop: 24, marginTop: 32 }}>
              <h3 style={{ fontWeight: 700, fontSize: 20 }}>3. Compare your project's fees</h3>
              <p style={{ fontSize: 14, margin: '8px 0 20px' }}>Same volume and fees. Two settlement types.</p>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(220px, 100%), 1fr))', gap: 16 }}>
                {[
                  ['Seller settlement', 0.3],
                  ['Oracle escrow settlement', 0.5],
                ].map(([label, fraction]) => (
                  <div className="cp-fees-card" key={label}>
                    <div style={{ fontSize: 16, fontWeight: 600 }}>{label}</div>
                    <div style={{ fontSize: 14, marginTop: 8 }}>{fraction * 100}% project fee share</div>
                    <div style={{ fontSize: 32, fontWeight: 700, marginTop: 16, overflowWrap: 'anywhere' }}>{money(fees * fraction)}</div>
                    <div style={{ fontSize: 12, marginTop: 4 }}>Your project's fees</div>
                    <div aria-hidden="true" style={{ height: 12, borderRadius: 6, background: '#80808020', overflow: 'hidden', marginTop: 16 }}>
                      <div style={{ height: '100%', width: fees === 0 ? '0%' : `${fraction * 100}%`, background: fraction === 0.5 ? '#32cdcd' : '#64748b' }} />
                    </div>
                  </div>
                ))}
              </div>
              <div style={{ borderLeft: '3px solid #32cdcd', paddingLeft: 16, marginTop: 24 }}>
                <div style={{ fontSize: 14, fontWeight: 600 }}>Additional project fees with oracle escrow</div>
                <div style={{ fontSize: 32, fontWeight: 700, marginTop: 6, overflowWrap: 'anywhere' }}>+{money(fees * 0.2)}</div>
                {fees > 0 && <div style={{ fontSize: 14, marginTop: 4 }}>66.7% more than seller settlement at the same volume and fees.</div>}
              </div>
              <p style={{ display: 'block', fontSize: 13, marginTop: 16 }}>Oracle escrow requires a points-transfer method and allocation delivery.</p>
            </section>
          </div>
        )}
      </div>
      <p style={{ fontSize: 12, marginTop: 18 }}>Calculation: (fee-bearing trade volume × assumed trade fee rate + collected cancellation fees) × project share. Use only volume on which the trade fee is collected. Excludes mint fees, deposit fees, secondary-market fees and per-transaction rounding. Estimates remain subject to the final fee policy, settlement and payout conditions.</p>
    </section>
  );
};
