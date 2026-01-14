'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

type Answers = Record<string, number>;

const questions = [
  {
    id: 'q1',
    text: 'I make a high number of small decisions every day that don’t feel important individually, but add up.',
  },
  {
    id: 'q2',
    text: 'I’m carrying several unfinished tasks or unresolved decisions that stay in the back of my mind.',
  },
  {
    id: 'q3',
    text: 'My day requires frequent switching between different types of tasks, roles, or responsibilities without much transition time.',
  },
  {
    id: 'q4',
    text: 'Other people regularly rely on me to manage, absorb, or respond to their needs, concerns, or problems.',
  },
  {
    id: 'q5',
    text: 'My time is broken into small blocks, making it hard to focus deeply on one thing.',
  },
  {
    id: 'q6',
    text: 'I’m responsible for outcomes that depend on other people, systems, or decisions I don’t fully control.',
  },
  {
    id: 'q7',
    text: 'I move from one obligation to the next with little uninterrupted downtime in between.',
  },
  {
    id: 'q8',
    text: 'I’m expected to operate in multiple roles within the same day or hour.',
  },
  {
    id: 'q9',
    text: 'I regularly say yes to things that add pressure, even when I know I’m near capacity.',
  },
  {
    id: 'q10',
    text: 'When I struggle to focus or start tasks, I assume it’s a motivation or discipline problem.',
  },
];

export default function HomePage() {
  const router = useRouter();
  const [answers, setAnswers] = useState<Answers>({});
  const [error, setError] = useState<string | null>(null);

  const handleChange = (id: string, value: number) => {
    setAnswers(prev => ({ ...prev, [id]: value }));
    setError(null);
  };

  const handleSubmit = () => {
    if (Object.keys(answers).length !== questions.length) {
      setError('Please answer all questions to continue.');
      return;
    }

    router.push(
      `/results?data=${encodeURIComponent(JSON.stringify(answers))}`
    );
  };

  return (
    <div className="page">
      <main>
        <h1>Load Calculator</h1>

        <p className="subtle">
          Answer honestly. This takes about two minutes.
        </p>

        <p className="subtle section--tight">
          <strong>0</strong> = rarely true · <strong>3</strong> = almost always true
        </p>

        <hr />

        {questions.map((q, index) => (
          <div key={q.id} className="section">
            <p>
              <strong>{index + 1}.</strong> {q.text}
            </p>

            <div className="section--tight">
              {[0, 1, 2, 3].map(value => (
                <label key={value}>
                  <input
                    type="radio"
                    name={q.id}
                    checked={answers[q.id] === value}
                    onChange={() => handleChange(q.id, value)}
                  />
                  {value}
                </label>
              ))}
            </div>
          </div>
        ))}

        {error && (
          <p className="subtle section" style={{ color: '#b91c1c' }}>
            {error}
          </p>
        )}

        <div className="section">
          <button onClick={handleSubmit}>
            See Results
          </button>
        </div>
      </main>
    </div>
  );
}
