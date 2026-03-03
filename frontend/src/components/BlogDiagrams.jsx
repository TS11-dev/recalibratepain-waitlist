import React from 'react';

// Biopsychosocial Model - 3 pillars
export const BiopsychosocialDiagram = () => (
  <div className="my-8 p-6 bg-white rounded-2xl border border-gray-100 shadow-sm">
    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest text-center mb-5">The Biopsychosocial System</p>
    <div className="grid grid-cols-3 gap-3 mb-4">
      {[
        { label: 'Biological', color: 'blue', items: ['Tissue health', 'Neurological state', 'Sleep quality', 'Inflammation'] },
        { label: 'Psychological', color: 'purple', items: ['Threat beliefs', 'Anxiety / fear', 'Attention focus', 'Past experience'] },
        { label: 'Social', color: 'rose', items: ['Support quality', 'Work stress', 'Cultural beliefs', 'Healthcare access'] },
      ].map(({ label, color, items }) => (
        <div key={label} className={`rounded-xl p-3 border-2 ${color === 'blue' ? 'bg-blue-50 border-blue-200' : color === 'purple' ? 'bg-purple-50 border-purple-200' : 'bg-rose-50 border-rose-200'}`}>
          <p className={`text-xs font-bold uppercase tracking-wide mb-2 ${color === 'blue' ? 'text-blue-700' : color === 'purple' ? 'text-purple-700' : 'text-rose-700'}`}>{label}</p>
          {items.map(i => <p key={i} className="text-xs text-gray-600 leading-tight mb-0.5">• {i}</p>)}
        </div>
      ))}
    </div>
    <div className="flex items-center justify-center gap-2">
      <div className="h-px flex-1 bg-gray-200" />
      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-xs font-bold px-4 py-2 rounded-full">PAIN OUTPUT</div>
      <div className="h-px flex-1 bg-gray-200" />
    </div>
    <p className="text-xs text-gray-400 text-center mt-3">All three systems run simultaneously. Dysregulation in one amplifies the others.</p>
  </div>
);

// Pain Decision Flow
export const PainDecisionDiagram = () => {
  const steps = [
    { num: '1', label: 'Nociception', sub: 'Tissue danger signal', color: 'bg-blue-100 border-blue-300 text-blue-800' },
    { num: '2', label: 'Spinal Gate', sub: 'Amplify or dampen', color: 'bg-amber-100 border-amber-300 text-amber-800' },
    { num: '3', label: 'Brain Evaluation', sub: 'Context + memory + emotion', color: 'bg-purple-100 border-purple-300 text-purple-800' },
    { num: '4', label: 'Pain Output', sub: 'If threat is confirmed', color: 'bg-red-100 border-red-300 text-red-800' },
  ];
  return (
    <div className="my-8 p-6 bg-white rounded-2xl border border-gray-100 shadow-sm">
      <p className="text-xs font-bold text-gray-400 uppercase tracking-widest text-center mb-5">How Pain is Actually Made</p>
      <div className="flex flex-col sm:flex-row items-center justify-between gap-2">
        {steps.map((s, i) => (
          <React.Fragment key={s.num}>
            <div className={`flex-1 rounded-xl border-2 p-3 text-center ${s.color}`}>
              <div className="text-lg font-black mb-1">{s.num}</div>
              <p className="text-xs font-bold">{s.label}</p>
              <p className="text-xs opacity-70 mt-0.5">{s.sub}</p>
            </div>
            {i < steps.length - 1 && <div className="text-gray-400 font-bold text-lg flex-shrink-0">→</div>}
          </React.Fragment>
        ))}
      </div>
      <p className="text-xs text-gray-400 text-center mt-4">Nociception is not pain. Pain is the brain's decision, not the tissue's signal.</p>
    </div>
  );
};

// Sleep-Pain Bidirectional Cycle
export const SleepPainCycleDiagram = () => (
  <div className="my-8 p-6 bg-white rounded-2xl border border-gray-100 shadow-sm">
    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest text-center mb-5">The Bidirectional Trap</p>
    <div className="flex items-center justify-center gap-4">
      <div className="bg-indigo-50 border-2 border-indigo-300 rounded-xl p-4 text-center w-36">
        <p className="text-sm font-bold text-indigo-800">Poor Sleep</p>
        <p className="text-xs text-indigo-600 mt-1">HPA dysregulation, elevated cortisol, reduced glymphatic clearance</p>
      </div>
      <div className="flex flex-col gap-3 items-center">
        <div className="flex items-center gap-1 text-red-500 text-xs font-semibold">
          <span>raises pain sensitivity</span><span>→</span>
        </div>
        <div className="flex items-center gap-1 text-purple-500 text-xs font-semibold">
          <span>←</span><span>disrupts sleep quality</span>
        </div>
      </div>
      <div className="bg-red-50 border-2 border-red-300 rounded-xl p-4 text-center w-36">
        <p className="text-sm font-bold text-red-800">Increased Pain</p>
        <p className="text-xs text-red-600 mt-1">Sensitized nervous system, elevated threat perception, inflammation</p>
      </div>
    </div>
    <p className="text-xs text-gray-400 text-center mt-4">One poor night raises pain sensitivity 15-25%. Breaking this cycle requires targeting both systems simultaneously.</p>
  </div>
);

// Two Components of Pain (for Mindfulness post)
export const PainComponentsDiagram = () => (
  <div className="my-8 p-6 bg-white rounded-2xl border border-gray-100 shadow-sm">
    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest text-center mb-5">What Mindfulness Actually Changes</p>
    <div className="grid grid-cols-2 gap-4">
      <div className="bg-orange-50 border-2 border-orange-200 rounded-xl p-4">
        <p className="text-xs font-bold text-orange-700 uppercase tracking-wide mb-2">Sensory Dimension</p>
        <p className="text-sm text-gray-700 font-medium">The raw physical sensation</p>
        <p className="text-xs text-gray-500 mt-2">Processed in somatosensory cortex</p>
        <div className="mt-3 flex items-center gap-2">
          <div className="h-2 flex-1 bg-orange-200 rounded-full"><div className="h-2 w-2/3 bg-orange-400 rounded-full" /></div>
          <span className="text-xs text-orange-600 font-semibold">Remains</span>
        </div>
      </div>
      <div className="bg-purple-50 border-2 border-purple-200 rounded-xl p-4">
        <p className="text-xs font-bold text-purple-700 uppercase tracking-wide mb-2">Affective Dimension</p>
        <p className="text-sm text-gray-700 font-medium">The emotional suffering</p>
        <p className="text-xs text-gray-500 mt-2">Processed in anterior cingulate cortex</p>
        <div className="mt-3 flex items-center gap-2">
          <div className="h-2 flex-1 bg-purple-200 rounded-full"><div className="h-2 w-1/4 bg-purple-500 rounded-full" /></div>
          <span className="text-xs text-purple-600 font-semibold">Reduced 40%</span>
        </div>
      </div>
    </div>
    <p className="text-xs text-gray-400 text-center mt-4">Mindfulness does not block pain. It separates sensation from suffering. You may still feel it. The distress around it decreases.</p>
  </div>
);

// Care Team Wheel
export const TeamWheelDiagram = () => {
  const roles = [
    { label: 'GP', sub: 'Coordinator', color: 'bg-blue-100 text-blue-800 border-blue-300' },
    { label: 'Physio', sub: 'Movement Re-educator', color: 'bg-green-100 text-green-800 border-green-300' },
    { label: 'Pain Psychologist', sub: 'System Re-programmer', color: 'bg-purple-100 text-purple-800 border-purple-300' },
    { label: 'OT', sub: 'Life Adapter', color: 'bg-amber-100 text-amber-800 border-amber-300' },
    { label: 'Pharmacist', sub: 'Chemistry Auditor', color: 'bg-rose-100 text-rose-800 border-rose-300' },
  ];
  return (
    <div className="my-8 p-6 bg-white rounded-2xl border border-gray-100 shadow-sm">
      <p className="text-xs font-bold text-gray-400 uppercase tracking-widest text-center mb-5">Your Core Chronic Pain Team</p>
      <div className="flex flex-col items-center gap-3">
        <div className="bg-indigo-600 text-white rounded-full w-16 h-16 flex items-center justify-center text-xs font-bold text-center leading-tight">YOU<br/>Patient</div>
        <div className="flex flex-wrap justify-center gap-2">
          {roles.map(r => (
            <div key={r.label} className={`rounded-xl border-2 px-3 py-2 text-center ${r.color}`}>
              <p className="text-xs font-bold">{r.label}</p>
              <p className="text-xs opacity-70">{r.sub}</p>
            </div>
          ))}
        </div>
      </div>
      <p className="text-xs text-gray-400 text-center mt-4">Chronic pain is not a single-system problem. No single clinician has all the tools.</p>
    </div>
  );
};

// Boom-Bust vs Pacing
export const BoomBustDiagram = () => (
  <div className="my-8 p-6 bg-white rounded-2xl border border-gray-100 shadow-sm">
    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest text-center mb-5">Boom-Bust vs Pacing</p>
    <div className="grid grid-cols-2 gap-4">
      <div className="bg-red-50 border-2 border-red-200 rounded-xl p-3">
        <p className="text-xs font-bold text-red-700 mb-3 text-center">Boom-Bust Pattern</p>
        <div className="flex items-end justify-between h-16 gap-1 px-2">
          {[40, 90, 30, 85, 20, 75, 25].map((h, i) => (
            <div key={i} className="flex-1 bg-red-400 rounded-t" style={{ height: `${h}%` }} />
          ))}
        </div>
        <div className="flex justify-between mt-1">
          <span className="text-xs text-red-500">Boom</span>
          <span className="text-xs text-red-500">Crash</span>
          <span className="text-xs text-red-500">Boom</span>
          <span className="text-xs text-red-500">Crash</span>
        </div>
        <p className="text-xs text-gray-500 mt-2 text-center">Unstable. Deconditioning continues.</p>
      </div>
      <div className="bg-green-50 border-2 border-green-200 rounded-xl p-3">
        <p className="text-xs font-bold text-green-700 mb-3 text-center">Pacing Pattern</p>
        <div className="flex items-end justify-between h-16 gap-1 px-2">
          {[45, 48, 50, 53, 55, 58, 62].map((h, i) => (
            <div key={i} className="flex-1 bg-green-400 rounded-t" style={{ height: `${h}%` }} />
          ))}
        </div>
        <div className="flex justify-between mt-1">
          <span className="text-xs text-green-600">Baseline</span>
          <span className="text-xs text-green-600 ml-auto">+10% increments</span>
        </div>
        <p className="text-xs text-gray-500 mt-2 text-center">Stable. Function builds over time.</p>
      </div>
    </div>
    <p className="text-xs text-gray-400 text-center mt-4">The 50% Rule: on good days, do 50-60% of what you think you can. Build the buffer for the delayed crash.</p>
  </div>
);

// Fibromyalgia Sensitization Spectrum
export const FibromyalgiaDiagram = () => (
  <div className="my-8 p-6 bg-white rounded-2xl border border-gray-100 shadow-sm">
    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest text-center mb-5">Central Sensitization Spectrum</p>
    <div className="relative mb-4">
      <div className="h-6 rounded-full overflow-hidden" style={{ background: 'linear-gradient(to right, #dcfce7, #fef9c3, #fee2e2, #fce7f3)' }} />
      <div className="flex justify-between text-xs font-semibold mt-1">
        <span className="text-green-700">Normal</span>
        <span className="text-amber-600">Sensitized</span>
        <span className="text-red-600">Fibromyalgia</span>
      </div>
    </div>
    <div className="grid grid-cols-3 gap-2 mt-4">
      {[
        { label: 'Light touch', states: ['No pain', 'Mild discomfort', 'Significant pain'] },
        { label: 'Firm pressure', states: ['Mild discomfort', 'Moderate pain', 'Severe pain'] },
        { label: 'Clothing / sheets', states: ['Not noticed', 'Noticeable', 'Painful (allodynia)'] },
      ].map(({ label, states }) => (
        <div key={label} className="bg-gray-50 rounded-lg p-2">
          <p className="text-xs font-bold text-gray-700 mb-1">{label}</p>
          {states.map((s, i) => (
            <p key={i} className={`text-xs ${i === 0 ? 'text-green-600' : i === 1 ? 'text-amber-600' : 'text-red-600'}`}>• {s}</p>
          ))}
        </div>
      ))}
    </div>
    <p className="text-xs text-gray-400 text-center mt-4">The same stimulus. Three completely different nervous system responses. This is central sensitization, not tissue damage.</p>
  </div>
);

// Central Sensitization Pathway
export const CentralSensitizationDiagram = () => (
  <div className="my-8 p-6 bg-white rounded-2xl border border-gray-100 shadow-sm">
    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest text-center mb-5">The Sensitized Pain Pathway</p>
    <div className="grid grid-cols-2 gap-4">
      <div>
        <p className="text-xs font-bold text-green-700 text-center mb-2">Normal Pathway</p>
        <div className="flex flex-col gap-2">
          {[['Stimulus', 'bg-gray-100 text-gray-700'], ['Spinal Gate (neutral)', 'bg-green-100 text-green-700'], ['Brain evaluation', 'bg-blue-100 text-blue-700'], ['Proportionate pain', 'bg-green-100 text-green-700']].map(([label, cls]) => (
            <div key={label} className={`${cls} rounded-lg px-3 py-2 text-xs font-medium text-center`}>{label}</div>
          ))}
        </div>
      </div>
      <div>
        <p className="text-xs font-bold text-red-700 text-center mb-2">Sensitized Pathway</p>
        <div className="flex flex-col gap-2">
          {[['Same Stimulus', 'bg-gray-100 text-gray-700'], ['Spinal Gate (AMPLIFIED)', 'bg-red-100 text-red-700'], ['Brain evaluation', 'bg-blue-100 text-blue-700'], ['Disproportionate pain', 'bg-red-100 text-red-700']].map(([label, cls]) => (
            <div key={label} className={`${cls} rounded-lg px-3 py-2 text-xs font-medium text-center`}>{label}</div>
          ))}
        </div>
      </div>
    </div>
    <p className="text-xs text-gray-400 text-center mt-4">Same stimulus. Same brain. Different spinal gate calibration. This is why treatment must target the nervous system, not just the tissue.</p>
  </div>
);

// Catastrophizing Loop
export const CatastrophizingLoopDiagram = () => {
  const steps = [
    { label: 'Pain Signal', color: 'bg-red-50 border-red-300 text-red-700' },
    { label: 'Catastrophic Thought', color: 'bg-orange-50 border-orange-300 text-orange-700' },
    { label: 'Threat Response (Amygdala fires, cortisol rises)', color: 'bg-amber-50 border-amber-300 text-amber-700' },
    { label: 'More Pain (dampening systems suppressed)', color: 'bg-red-50 border-red-300 text-red-700' },
  ];
  return (
    <div className="my-8 p-6 bg-white rounded-2xl border border-gray-100 shadow-sm">
      <p className="text-xs font-bold text-gray-400 uppercase tracking-widest text-center mb-5">The Catastrophizing Loop</p>
      <div className="grid grid-cols-2 gap-3">
        {steps.map((s, i) => (
          <div key={i} className={`rounded-xl border-2 p-3 text-center ${s.color} relative`}>
            <p className="text-xs font-bold">{s.label}</p>
            <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 text-gray-400 text-base">{i < steps.length - 1 ? '↓' : ''}</div>
          </div>
        ))}
      </div>
      <div className="mt-4 text-center">
        <span className="text-xs text-gray-400">The loop becomes self-confirming. Catastrophizing creates the conditions for the catastrophe it predicted.</span>
      </div>
    </div>
  );
};

// Evidence comparison for non-medication post
export const TreatmentEvidenceDiagram = () => {
  const treatments = [
    { name: 'Exercise Therapy', level: 92, color: 'bg-green-500', note: 'Strong' },
    { name: 'CBT for Pain', level: 88, color: 'bg-green-500', note: 'Strong' },
    { name: 'Pain Neuroscience Ed.', level: 82, color: 'bg-green-400', note: 'Strong' },
    { name: 'MBSR', level: 74, color: 'bg-blue-400', note: 'Moderate-Strong' },
    { name: 'Physical Therapy + PNE', level: 80, color: 'bg-blue-500', note: 'Strong' },
    { name: 'Gabapentin (short-term)', level: 58, color: 'bg-amber-400', note: 'Moderate' },
    { name: 'Gabapentin (long-term)', level: 28, color: 'bg-red-400', note: 'Concerns' },
  ];
  return (
    <div className="my-8 p-6 bg-white rounded-2xl border border-gray-100 shadow-sm">
      <p className="text-xs font-bold text-gray-400 uppercase tracking-widest text-center mb-5">Evidence Strength: Chronic Pain Interventions</p>
      <div className="space-y-2">
        {treatments.map(t => (
          <div key={t.name} className="flex items-center gap-3">
            <p className="text-xs text-gray-700 w-44 flex-shrink-0 font-medium">{t.name}</p>
            <div className="flex-1 bg-gray-100 rounded-full h-4 overflow-hidden">
              <div className={`h-4 rounded-full ${t.color} transition-all`} style={{ width: `${t.level}%` }} />
            </div>
            <span className={`text-xs font-semibold w-24 text-right ${t.color.replace('bg-', 'text-').replace('-400', '-700').replace('-500', '-700')}`}>{t.note}</span>
          </div>
        ))}
      </div>
      <p className="text-xs text-gray-400 text-center mt-4">Non-pharmacological approaches match or outperform medication in most chronic pain conditions, with sustained effects after treatment ends.</p>
    </div>
  );
};

// Export a map for easy lookup by key
export const DIAGRAM_MAP = {
  biopsychosocial: BiopsychosocialDiagram,
  paindecision: PainDecisionDiagram,
  sleeppain: SleepPainCycleDiagram,
  mindfulnesspain: PainComponentsDiagram,
  teamwheel: TeamWheelDiagram,
  boombust: BoomBustDiagram,
  fibromyalgia: FibromyalgiaDiagram,
  centralsensitization: CentralSensitizationDiagram,
  catastrophizing: CatastrophizingLoopDiagram,
  treatmentevidence: TreatmentEvidenceDiagram,
};
