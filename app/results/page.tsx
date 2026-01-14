export const dynamic = 'force-dynamic';

'use client';

import { useSearchParams } from 'next/navigation';

type Answers = Record<string, number>;
type LoadType = 'decision' | 'cognitive' | 'emotional';

type ResultData = {
  dominant: LoadType;
  secondary: LoadType;
  severity: 'low' | 'moderate' | 'high';
  recovery: boolean;
  reframe: boolean;
};

/* -----------------------------
   Scoring Logic
------------------------------ */
function calculateScore(answers: Answers): ResultData {
  const q = (id: string) => Number(answers[id] ?? 0);

  const decision = (q('q1') / 3) * 100;

  const cognitiveRaw =
    q('q2') + q('q3') + q('q5') + q('q8');

  const emotionalRaw =
    q('q4') + q('q9');

  let cognitive = (cognitiveRaw / 12) * 100;
  let emotional = (emotionalRaw / 6) * 100;

  const responsibilityFactor = q('q6') / 3;
  cognitive += responsibilityFactor * 10;
  emotional += responsibilityFactor * 15;

  const scores = { decision, cognitive, emotional };
  const sorted = Object.entries(scores).sort((a, b) => b[1] - a[1]);

  const dominant = sorted[0][0] as LoadType;
  const secondary = sorted[1][0] as LoadType;
  const max = sorted[0][1];

  let severity: 'low' | 'moderate' | 'high' = 'moderate';
  if (max >= 70) severity = 'high';
  if (max < 45) severity = 'low';

  if (q('q7') >= 2 && severity === 'moderate') {
    severity = 'high';
  }

  return {
    dominant,
    secondary,
    severity,
    recovery: q('q7') >= 2,
    reframe: q('q10') >= 2,
  };
}

/* -----------------------------
   Snapshot Copy
------------------------------ */
const RESULT_COPY: Record<
  LoadType,
  Record<'low' | 'moderate' | 'high', string>
> = {
  decision: {
    low: 'You’re making decisions, but they’re not currently overwhelming your capacity.',
    moderate: 'Decision volume is taking up more mental space than it appears.',
    high: 'The sheer number of decisions you’re making is actively draining your capacity.',
  },
  cognitive: {
    low: 'Your thinking load is present but largely contained.',
    moderate: 'Open loops and context switching are consuming meaningful capacity.',
    high: 'Unfinished thinking and fragmentation are heavily taxing your mental bandwidth.',
  },
  emotional: {
    low: 'Emotional responsibility is present but manageable.',
    moderate: 'Responsibility for others is adding noticeable mental weight.',
    high: 'Responsibility without control is significantly draining your capacity.',
  },
};

export default function ResultsPage() {
  const params = useSearchParams();
  const raw = params.get('data');

  if (!raw) {
    return (
      <div className="page">
        <main>
          <p>No results data found.</p>
        </main>
      </div>
    );
  }

  let answers: Answers;

  try {
    answers = JSON.parse(raw);
  } catch {
    return (
      <div className="page">
        <main>
          <p>Invalid results data.</p>
        </main>
      </div>
    );
  }

  const result = calculateScore(answers);
  const summary = RESULT_COPY[result.dominant][result.severity];

  return (
    <div className="page">
      <main>
        <h1>Your Load Snapshot</h1>

        <p className="lead section">
          {summary}
        </p>

        <p className="subtle section--tight">
          Primary load: <strong>{result.dominant}</strong> ·{' '}
          Current intensity: <strong>{result.severity}</strong>
        </p>

        <div className="callout">
          <p>
            This snapshot reflects structural load patterns,
            not personal shortcomings.
          </p>

          <p className="subtle section--tight">
            Full breakdown: <strong>$9 one-time</strong>
          </p>

          <p className="subtle section--tight">
            No account. No subscription.
          </p>

          <button
            onClick={() =>
              window.location.href =
                `/breakdown?data=${encodeURIComponent(
                  JSON.stringify(result)
                )}`
            }
          >
            View Full Breakdown
          </button>
        </div>
      </main>
    </div>
  );
}
