'use client';

export const dynamic = 'force-dynamic';

import { useSearchParams } from 'next/navigation';

type LoadType = 'decision' | 'cognitive' | 'emotional';

type ResultData = {
  dominant: LoadType;
  secondary: LoadType;
  severity: 'low' | 'moderate' | 'high';
  recovery: boolean;
  reframe: boolean;
};

type ChangeBlock = {
  headline: string;
  body: string[];
};

type VariantGroup = {
  decision?: ChangeBlock;
  cognitive?: ChangeBlock;
  emotional?: ChangeBlock;
  default: ChangeBlock;
};

const LOAD_LABELS: Record<LoadType, string> = {
  decision: 'Decision Load',
  cognitive: 'Cognitive Load',
  emotional: 'Emotional Load',
};

const CHANGE_THE_MATH_COPY: Record<LoadType, VariantGroup> = {
  cognitive: {
    decision: {
      headline: 'Fragmentation Is Being Amplified by Decisions',
      body: [
        'Your cognitive load is being driven by unfinished thinking and frequent context switching.',
        'Decision volume compounds this fragmentation, increasing mental strain.',
        'This creates persistent mental noise even when individual tasks are manageable.',
      ],
    },
    emotional: {
      headline: 'Cognitive Load Is Being Carried Into Emotional Space',
      body: [
        'Your primary strain is cognitive, but it is intensified by responsibility and interpersonal demands.',
        'Open loops tend to linger longer when emotional carry is present.',
        'This combination reduces the effectiveness of recovery.',
      ],
    },
    default: {
      headline: 'Open Loops Are Consuming Capacity',
      body: [
        'Your load is being driven by unfinished thinking, context switching, and fragmentation.',
        'Even a single recurring open loop can account for more strain than it appears.',
        'This kind of load persists even when total workload is reasonable.',
      ],
    },
  },

  decision: {
    cognitive: {
      headline: 'Decision Volume Is Creating Cognitive Drag',
      body: [
        'Your primary load comes from the number of decisions you are making.',
        'These decisions generate downstream cognitive strain and mental fatigue.',
        'Choice density matters more than effort in this pattern.',
      ],
    },
    emotional: {
      headline: 'Decision Pressure Is Being Felt Emotionally',
      body: [
        'Your decision load is intensified by responsibility toward others.',
        'Choices carry emotional weight, not just cognitive effort.',
        'This makes even small decisions feel heavier than expected.',
      ],
    },
    default: {
      headline: 'Decision Volume Is the Multiplier',
      body: [
        'Your load is amplified by the number of decisions you are required to make.',
        'Decision density increases strain even when responsibility stays constant.',
        'Effort-based fixes often fail when choice volume remains high.',
      ],
    },
  },

  emotional: {
    cognitive: {
      headline: 'Responsibility Is Prolonging Cognitive Load',
      body: [
        'Emotional responsibility makes cognitive demands harder to resolve.',
        'Tasks tend to linger longer when responsibility without control is present.',
        'This increases overall strain without increasing visible workload.',
      ],
    },
    decision: {
      headline: 'Responsibility Is Compounding Decision Pressure',
      body: [
        'Emotional load increases the cost of each decision you make.',
        'Choices feel heavier when outcomes affect others.',
        'This compounds fatigue even when decision volume is moderate.',
      ],
    },
    default: {
      headline: 'Responsibility Without Control Is the Driver',
      body: [
        'Your load is amplified by responsibility for outcomes you do not fully control.',
        'Emotional carry consumes capacity independently of productivity.',
        'This is why rest alone often fails to resolve this kind of strain.',
      ],
    },
  },
};

export default function BreakdownPage() {
  const params = useSearchParams();
  const raw = params.get('data');

  if (!raw) {
    return (
      <div className="page">
        <main>
          <p>No breakdown data found.</p>
        </main>
      </div>
    );
  }

  let data: ResultData;

  try {
    data = JSON.parse(raw);
  } catch {
    return (
      <div className="page">
        <main>
          <p>Invalid breakdown data.</p>
        </main>
      </div>
    );
  }

  const group = CHANGE_THE_MATH_COPY[data.dominant];
  const change =
    group[data.secondary as keyof VariantGroup] ?? group.default;

  return (
    <div className="page">
      <main>
        <h1>Full Load Breakdown</h1>

        <p className="subtle">
          This report explains where your mental load is coming from and why it feels the way it does.
        </p>

        <hr />

        <h2>Primary Load Driver</h2>
        <p>
          <strong>{LOAD_LABELS[data.dominant]}</strong> is currently the largest contributor to your overall load.
        </p>

        <hr />

        <h2 className="main-insight">{change.headline}</h2>

        {change.body.map((line, i) => (
          <p key={i}>{line}</p>
        ))}

        <hr />

        <p className="subtle">
          This breakdown focuses on structural load, not personal shortcomings.
          No diagnosis. No prescriptions.
        </p>
      </main>
    </div>
  );
}
