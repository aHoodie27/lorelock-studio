import { useEffect, useMemo, useState, type ChangeEvent } from 'react';
import type { ProductionPlan, ValidationResult } from '../shared/contracts';

type Health = { ok: boolean; live: boolean; model: string };
type LedgerEntry = ValidationResult & { shotId: string; createdAt: string };

const ledgerStorageKey = 'lorelock-evidence-ledger-v1';

const initialCandidate =
  'Kestrel-9 projects the blue route map while Mara wears a white coat with loose black hair and holds a laser sword. A second traveler stands physically beside her.';

function statusLabel(status: 'pass' | 'warn' | 'fail') {
  return status === 'pass' ? 'Pass' : status === 'warn' ? 'Watch' : 'Drift';
}

function App() {
  const [health, setHealth] = useState<Health>({ ok: false, live: false, model: 'gpt-5.6' });
  const [canonText, setCanonText] = useState('');
  const [sceneText, setSceneText] = useState('');
  const [plan, setPlan] = useState<ProductionPlan | null>(null);
  const [selectedShotId, setSelectedShotId] = useState('');
  const [candidateDescription, setCandidateDescription] = useState(initialCandidate);
  const [imageDataUrl, setImageDataUrl] = useState<string>();
  const [result, setResult] = useState<ValidationResult | null>(null);
  const [ledger, setLedger] = useState<LedgerEntry[]>(() => {
    try {
      const saved = window.localStorage.getItem(ledgerStorageKey);
      return saved ? JSON.parse(saved) as LedgerEntry[] : [];
    } catch {
      return [];
    }
  });
  const [loading, setLoading] = useState<'plan' | 'validate' | null>(null);
  const [error, setError] = useState('');
  const [mode, setMode] = useState<'live' | 'demo'>('demo');

  useEffect(() => {
    Promise.all([
      fetch('/api/health').then((res) => res.json()),
      fetch('/api/demo').then((res) => res.json()),
    ])
      .then(([healthPayload, demo]) => {
        setHealth(healthPayload);
        setMode(healthPayload.live ? 'live' : 'demo');
        setCanonText(demo.canonText);
        setSceneText(demo.sceneText);
      })
      .catch(() => setError('The API is not reachable. Start the LoreLock server and refresh.'));
  }, []);

  useEffect(() => {
    window.localStorage.setItem(ledgerStorageKey, JSON.stringify(ledger));
  }, [ledger]);

  const selectedShot = useMemo(
    () => plan?.shots.find((shot) => shot.id === selectedShotId) || plan?.shots[0],
    [plan, selectedShotId],
  );

  async function compilePlan() {
    setLoading('plan');
    setError('');
    setResult(null);
    try {
      const response = await fetch('/api/plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ canonText, sceneText }),
      });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.error || 'Planning failed');
      setPlan(payload.plan);
      setMode(payload.mode);
      setSelectedShotId(payload.plan.shots[0]?.id || '');
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'Planning failed');
    } finally {
      setLoading(null);
    }
  }

  async function validatePanel() {
    if (!plan || !selectedShot) return;
    setLoading('validate');
    setError('');
    try {
      const response = await fetch('/api/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          plan,
          shotId: selectedShot.id,
          candidateDescription,
          ...(imageDataUrl ? { imageDataUrl } : {}),
        }),
      });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.error || 'Validation failed');
      setResult(payload.result);
      setMode(payload.mode);
      setLedger((current) => [
        { ...payload.result, shotId: selectedShot.id, createdAt: new Date().toISOString() },
        ...current.filter((entry) => entry.shotId !== selectedShot.id),
      ]);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'Validation failed');
    } finally {
      setLoading(null);
    }
  }

  function handleImage(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    if (file.size > 5_500_000) {
      setError('Use an image smaller than 5.5 MB for the hackathon demo.');
      return;
    }
    const reader = new FileReader();
    reader.onload = () => setImageDataUrl(String(reader.result));
    reader.readAsDataURL(file);
  }

  function loadSafeCandidate() {
    setCandidateDescription(
      'Mara faces forward in her charcoal pressure suit, long silver braid and amber visor visible. The key on her left glove projects a blue triangular route map. Kestrel-9 scans the vines with red light, while the stranger appears only as a silhouette reflected in fractured glass.',
    );
    setResult(null);
  }

  function loadDriftedCandidate() {
    setCandidateDescription(initialCandidate);
    setResult(null);
  }

  function exportLedger() {
    const artifact = {
      exportedAt: new Date().toISOString(),
      project: plan?.projectTitle || 'LoreLock Studio',
      runtime: { mode, model: health.model },
      entries: ledger,
    };
    const url = URL.createObjectURL(new Blob([JSON.stringify(artifact, null, 2)], { type: 'application/json' }));
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = 'lorelock-evidence-ledger.json';
    anchor.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="app-shell">
      <div className="ambient ambient-one" />
      <div className="ambient ambient-two" />

      <header className="topbar">
        <a className="brand" href="#top" aria-label="LoreLock home">
          <span className="brand-mark">L</span>
          <span>LoreLock <strong>Studio</strong></span>
        </a>
        <div className="topbar-actions">
          <span className={`runtime-pill ${health.live ? 'is-live' : ''}`}>
            <i /> {health.live ? `Live · ${health.model}` : 'Judge-ready demo mode'}
          </span>
          <a className="ghost-button compact" href="#workspace">Open workspace</a>
        </div>
      </header>

      <main id="top">
        <section className="hero">
          <div className="eyebrow"><span>Continuity intelligence</span><span>01</span></div>
          <h1>Your story has a memory.<br /><em>Now your AI does too.</em></h1>
          <p className="hero-copy">
            LoreLock turns source canon into production constraints, converts scenes into shot-ready plans,
            and catches visual drift before it reaches your audience.
          </p>
          <div className="hero-actions">
            <a className="primary-button" href="#workspace">Run the proof case <span>↘</span></a>
            <span className="microcopy">Built with Codex + GPT‑5.6</span>
          </div>
          <div className="signal-grid" aria-label="Product capabilities">
            <div><strong>Canon graph</strong><span>Locks identity, powers, wardrobe, places, and rules.</span></div>
            <div><strong>Shot planner</strong><span>Translates narrative beats into production-ready frames.</span></div>
            <div><strong>Drift detector</strong><span>Explains failures and returns a corrected prompt.</span></div>
            <div><strong>Evidence ledger</strong><span>Records what passed, what failed, and why.</span></div>
          </div>
        </section>

        <section className="workspace" id="workspace">
          <div className="section-heading">
            <div>
              <span className="kicker">Production workspace</span>
              <h2>From canon to camera-ready</h2>
            </div>
            <span className="step-label">01 / Compile</span>
          </div>

          <div className="input-grid">
            <label className="editor-panel">
              <span className="editor-head"><b>Canon source</b><small>{canonText.length.toLocaleString()} chars</small></span>
              <textarea value={canonText} onChange={(event) => setCanonText(event.target.value)} />
            </label>
            <label className="editor-panel scene-editor">
              <span className="editor-head"><b>Scene to produce</b><small>One coherent sequence</small></span>
              <textarea value={sceneText} onChange={(event) => setSceneText(event.target.value)} />
            </label>
          </div>

          {error && <div className="error-banner"><b>Run stopped</b><span>{error}</span></div>}

          <div className="compile-row">
            <button className="primary-button" onClick={compilePlan} disabled={Boolean(loading)}>
              {loading === 'plan' ? 'Compiling canon…' : 'Compile canon + shot plan'} <span>→</span>
            </button>
            <p>GPT‑5.6 extracts only supported facts and makes high-risk continuity points explicit.</p>
          </div>
        </section>

        {plan && (
          <>
            <section className="plan-section">
              <div className="section-heading">
                <div>
                  <span className="kicker">Structured production plan</span>
                  <h2>{plan.projectTitle}</h2>
                </div>
                <span className="step-label">02 / Plan</span>
              </div>
              <p className="logline">{plan.logline}</p>

              <div className="plan-layout">
                <aside className="canon-rail">
                  <div className="rail-title"><span>Locked canon</span><b>{plan.canon.length}</b></div>
                  {plan.canon.map((entity) => (
                    <article className="canon-card" key={`${entity.kind}-${entity.name}`}>
                      <span>{entity.kind}</span>
                      <h3>{entity.name}</h3>
                      <ul>{entity.lockedFacts.slice(0, 4).map((fact) => <li key={fact}>{fact}</li>)}</ul>
                    </article>
                  ))}
                </aside>

                <div className="shots-column">
                  <div className="rail-title"><span>Shot sequence</span><b>{plan.shots.length}</b></div>
                  {plan.shots.map((shot, index) => (
                    <button
                      className={`shot-card ${selectedShot?.id === shot.id ? 'selected' : ''}`}
                      key={shot.id}
                      onClick={() => { setSelectedShotId(shot.id); setResult(null); }}
                    >
                      <span className="shot-index">{String(index + 1).padStart(2, '0')}</span>
                      <span className="shot-main">
                        <span className="shot-meta"><b>{shot.id}</b><i className={`risk ${shot.continuityRisk}`}>{shot.continuityRisk} risk</i></span>
                        <strong>{shot.beat}</strong>
                        <small>{shot.framing}</small>
                      </span>
                      <span className="shot-arrow">↗</span>
                    </button>
                  ))}
                  <div className="risk-callout"><b>Continuity risk</b><p>{plan.riskSummary}</p></div>
                </div>
              </div>
            </section>

            <section className="validation-section">
              <div className="section-heading">
                <div>
                  <span className="kicker">Continuity gate</span>
                  <h2>Inspect before approval</h2>
                </div>
                <span className="step-label">03 / Validate</span>
              </div>

              <div className="validation-grid">
                <div className="candidate-panel">
                  <div className="candidate-preview">
                    {imageDataUrl ? (
                      <img src={imageDataUrl} alt="Uploaded candidate panel" />
                    ) : (
                      <div className="preview-placeholder">
                        <span className="scan-line" />
                        <b>Visual input optional</b>
                        <small>GPT‑5.6 can inspect an uploaded panel or validate the production description alone.</small>
                      </div>
                    )}
                    <label className="upload-button">
                      <input type="file" accept="image/png,image/jpeg,image/webp" onChange={handleImage} />
                      {imageDataUrl ? 'Replace panel' : 'Upload panel'}
                    </label>
                  </div>
                  <div className="candidate-copy">
                    <div className="selected-spec">
                      <span>Selected spec</span>
                      <b>{selectedShot?.id}</b>
                      <p>{selectedShot?.beat}</p>
                    </div>
                    <label>
                      <span>Candidate description</span>
                      <textarea value={candidateDescription} onChange={(event) => setCandidateDescription(event.target.value)} />
                    </label>
                    <div className="candidate-actions">
                      <button className="primary-button" onClick={validatePanel} disabled={Boolean(loading)}>
                        {loading === 'validate' ? 'Inspecting continuity…' : 'Run continuity check'} <span>◎</span>
                      </button>
                      <button className="text-button" onClick={loadDriftedCandidate}>Load drifted version</button>
                      <button className="text-button" onClick={loadSafeCandidate}>Load canon-safe version</button>
                    </div>
                  </div>
                </div>

                <aside className={`result-panel ${result ? `verdict-${result.verdict}` : ''}`}>
                  {!result ? (
                    <div className="empty-result">
                      <div className="radar"><i /><i /><i /></div>
                      <h3>Awaiting inspection</h3>
                      <p>Run the selected shot through the continuity gate to create an evidence-backed verdict.</p>
                    </div>
                  ) : (
                    <>
                      <div className="verdict-head">
                        <div><span>Continuity verdict</span><h3>{result.verdict}</h3></div>
                        <strong>{result.continuityScore}<small>/100</small></strong>
                      </div>
                      <p className="result-summary">{result.summary}</p>
                      <div className="checks">
                        {result.checks.map((check) => (
                          <div className="check-row" key={check.label}>
                            <i className={check.status}>{check.status === 'pass' ? '✓' : check.status === 'warn' ? '!' : '×'}</i>
                            <span><b>{check.label}</b><small>{check.evidence}</small></span>
                            <em>{statusLabel(check.status)}</em>
                          </div>
                        ))}
                      </div>
                      {result.corrections.length > 0 && (
                        <div className="corrections"><span>Required corrections</span><ol>{result.corrections.map((item) => <li key={item}>{item}</li>)}</ol></div>
                      )}
                      <div className="approved-prompt"><span>Production-safe prompt</span><p>{result.approvedPrompt}</p></div>
                      <div className="evidence-stamp"><span>Evidence ID</span><code>{result.evidenceId}</code></div>
                    </>
                  )}
                </aside>
              </div>
            </section>
          </>
        )}

        <section className="ledger-section">
          <div className="section-heading">
            <div><span className="kicker">Trust layer</span><h2>Evidence, not vibes.</h2></div>
            <div className="ledger-actions">
              <span className="step-label">04 / Record</span>
              <button className="ghost-button compact" onClick={exportLedger} disabled={ledger.length === 0}>Export JSON</button>
            </div>
          </div>
          <div className="ledger-table">
            <div className="ledger-head"><span>Shot</span><span>Verdict</span><span>Score</span><span>Evidence</span><span>Timestamp</span></div>
            {ledger.length === 0 ? (
              <div className="ledger-empty">Validated shots will appear here with durable evidence IDs.</div>
            ) : ledger.map((entry) => (
              <div className="ledger-row" key={`${entry.shotId}-${entry.evidenceId}`}>
                <b>{entry.shotId}</b><span className={`ledger-verdict ${entry.verdict}`}>{entry.verdict}</span>
                <strong>{entry.continuityScore}</strong><code>{entry.evidenceId}</code>
                <time>{new Date(entry.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</time>
              </div>
            ))}
          </div>
        </section>
      </main>

      <footer>
        <div className="brand"><span className="brand-mark">L</span><span>LoreLock Studio</span></div>
        <p>Canon-safe production for stories too important to drift.</p>
        <span>OpenAI Build Week · 2026</span>
      </footer>
    </div>
  );
}

export default App;
