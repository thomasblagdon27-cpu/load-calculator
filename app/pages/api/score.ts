import type { NextApiRequest, NextApiResponse } from 'next';

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const answers = req.body as Record<string, number>;

  const q = (id: string) => Number(answers[id] || 0);

  const decision = (q('q1') / 3) * 100;

  const cognitiveRaw =
    q('q2') + q('q3') + q('q5') + q('q8') + (q('q6') * 0.5);
  const cognitive = (cognitiveRaw / 12) * 100;

  const emotionalRaw =
    q('q4') + q('q9') + (q('q6') * 0.5);
  const emotional = (emotionalRaw / 6) * 100;

  let dominant = 'cognitive';
  let max = cognitive;

  if (decision > max) {
    dominant = 'decision';
    max = decision;
  }

  if (emotional > max + 5) {
    dominant = 'emotional';
    max = emotional;
  }

  let severity = 'moderate';
  if (max >= 65) severity = 'high';

  if (q('q7') >= 2 && severity === 'moderate') {
    severity = 'high';
  }

  return res.status(200).json({
    dominant,
    severity,
    recovery: q('q7') >= 2,
    reframe: q('q10') >= 2,
  });
}
