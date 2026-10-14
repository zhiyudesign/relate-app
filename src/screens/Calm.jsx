import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Screen, Button, Img } from '../components/ui'
import { ArrowLeft, ArrowRight } from '../components/Icons'

/* ---------------------------------------------------------------- Data
   Box Breathing and Tree Pose copy comes straight from the Figma file.
   The other exercises/poses only had list entries in Figma, so their
   instructions are written to match that style. */
export const BREATHING = [
  {
    id: 'box',
    name: 'Box Breathing',
    intro: 'Inhale, hold, exhale, and hold again for a count of 4 seconds each to relieve stress and improve focus.',
    steps: [
      'Sit comfortably with your back straight.',
      'Exhale fully.',
      'Inhale through your nose for 4 counts.',
      'Hold your breath for 4 counts.',
      'Exhale slowly through your mouth for 4 counts.',
      'Hold again for 4 counts.',
      'Repeat for a few rounds (4-5 minutes).',
    ],
    pattern: [
      ['Inhale', 4],
      ['Hold', 4],
      ['Exhale', 4],
      ['Hold', 4],
    ],
  },
  {
    id: 'deep',
    name: 'Deep Breathing',
    intro: 'Slow, full breaths into your belly signal to your body that it is safe to relax.',
    steps: [
      'Sit or lie down comfortably.',
      'Place one hand on your chest and one on your belly.',
      'Inhale slowly through your nose for 5 counts, letting your belly rise.',
      'Exhale gently through your mouth for 5 counts.',
      'Repeat for 1–2 minutes.',
    ],
    pattern: [
      ['Inhale', 5],
      ['Exhale', 5],
    ],
  },
  {
    id: '478',
    name: '4-7-8 Breathing',
    intro: 'A long exhale slows your heart rate, which helps right before a stressful conversation.',
    steps: [
      'Sit comfortably with your back straight.',
      'Inhale quietly through your nose for 4 counts.',
      'Hold your breath for 7 counts.',
      'Exhale completely through your mouth for 8 counts.',
      'Repeat 4 times.',
    ],
    pattern: [
      ['Inhale', 4],
      ['Hold', 7],
      ['Exhale', 8],
    ],
  },
  {
    id: 'pursed',
    name: 'Pursed-Lip Breathing',
    intro: 'Exhaling through pursed lips slows your breathing and helps you feel more in control.',
    steps: [
      'Relax your neck and shoulders.',
      'Inhale through your nose for 2 counts.',
      'Purse your lips as if blowing out a candle.',
      'Exhale slowly through your lips for 4 counts.',
      'Repeat for 1–2 minutes.',
    ],
    pattern: [
      ['Inhale', 2],
      ['Exhale', 4],
    ],
  },
  {
    id: 'diaphragm',
    name: 'Diaphragmatic Breathing',
    intro: 'Also called belly breathing, it strengthens your diaphragm and eases tension in your body.',
    steps: [
      'Lie down or sit with your knees bent.',
      'Place one hand on your belly.',
      'Inhale through your nose so your belly pushes against your hand for 4 counts.',
      'Exhale through pursed lips for 6 counts.',
      'Repeat for 5–10 minutes.',
    ],
    pattern: [
      ['Inhale', 4],
      ['Exhale', 6],
    ],
  },
]

export const YOGA = [
  {
    id: 'child',
    name: 'Child’s Pose',
    tagline: 'Rest, release tension, and quiet your mind.',
    steps: [
      ['Kneel', 'Sit back on your heels, knees apart.'],
      ['Fold', 'Lean forward and rest your forehead down.'],
      ['Arms', 'Stretch them forward or rest by your sides.'],
      ['Breathe', 'Slow breaths into your back.'],
      ['Hold', 'Stay for 1–3 minutes.'],
    ],
  },
  {
    id: 'pigeon',
    name: 'Reclined Pigeon Pose',
    tagline: 'Gently open your hips and let go of stress.',
    steps: [
      ['Lie Down', 'On your back, knees bent, feet flat.'],
      ['Cross', 'Rest your right ankle over your left knee.'],
      ['Hug', 'Draw your left thigh toward your chest.'],
      ['Relax', 'Keep your head and shoulders down.'],
      ['Hold', 'Stay for 5–10 breaths → switch sides'],
    ],
  },
  {
    id: 'tree',
    name: 'Tree Pose',
    tagline: 'Build balance, focus, and stability.',
    image: 'yoga-tree.png',
    steps: [
      ['Set Your Base', 'Stand tall, feet hip-width apart.'],
      ['Shift Weight', 'Move weight onto one leg.'],
      ['Place Foot', 'Rest foot on inner calf or thigh'],
      ['Align', 'Keep hips level, core engaged.'],
      ['Arms', 'Hands at chest or reach overhead.'],
      ['Focus', 'Gaze at one fixed point.'],
      ['Hold', 'Stay for 5–10 breaths → switch sides'],
    ],
  },
  {
    id: 'triangle',
    name: 'Triangle Pose',
    tagline: 'Stretch your sides and feel grounded.',
    steps: [
      ['Stance', 'Step your feet wide apart.'],
      ['Turn', 'Point your front foot forward.'],
      ['Reach', 'Extend forward, then lower your hand to your shin.'],
      ['Open', 'Lift your other arm toward the sky.'],
      ['Hold', 'Stay for 5 breaths → switch sides'],
    ],
  },
  {
    id: 'cat-cow',
    name: 'Cat-Cow Pose',
    tagline: 'Sync movement with breath to ease stress.',
    steps: [
      ['Start', 'On hands and knees, back flat.'],
      ['Cow', 'Inhale, drop your belly and lift your gaze.'],
      ['Cat', 'Exhale, round your back and tuck your chin.'],
      ['Flow', 'Move slowly with each breath.'],
      ['Repeat', '5–10 rounds.'],
    ],
  },
  {
    id: 'reclining',
    name: 'Reclining Pose',
    tagline: 'Let your whole body rest and reset.',
    steps: [
      ['Lie Down', 'On your back, legs extended.'],
      ['Arms', 'Rest them by your sides, palms up.'],
      ['Soften', 'Relax your face, jaw, and shoulders.'],
      ['Breathe', 'Let your breath slow naturally.'],
      ['Hold', 'Stay for 3–5 minutes.'],
    ],
  },
  {
    id: 'twist',
    name: 'Side Lying Twist Pose',
    tagline: 'Release your spine and calm your nervous system.',
    steps: [
      ['Lie Down', 'On your back, knees bent.'],
      ['Arms', 'Open them out to a T shape.'],
      ['Twist', 'Lower both knees to one side.'],
      ['Gaze', 'Turn your head the opposite way.'],
      ['Hold', 'Stay for 5–10 breaths → switch sides'],
    ],
  },
]

function BackButton({ to, label }) {
  const navigate = useNavigate()
  return (
    <Button wide={false} style={{ minWidth: 250 }} onClick={() => navigate(to)}>
      <ArrowLeft width={18} height={18} />
      {label}
    </Button>
  )
}

/* -------------------------------------------------------------- Landing */
export function CalmLanding() {
  const navigate = useNavigate()
  return (
    <Screen tabs="calm">
      <h1 className="h1" style={{ marginTop: 16 }}>
        Calming Techniques
      </h1>
      <div className="stack" style={{ marginTop: 16 }}>
        <button type="button" className="big-card" onClick={() => navigate('/calm/breathing')}>
          <Img src="icon-breathing.png" width={64} height={64} />
          Breathing Exercises
        </button>
        <button type="button" className="big-card" onClick={() => navigate('/calm/yoga')}>
          <Img src="icon-yoga.png" width={64} height={64} />
          Yoga Poses
        </button>
      </div>
      <div style={{ position: 'relative', height: 246, marginTop: 110, maxWidth: 368, marginLeft: 20 }}>
        <Img src="calm-yoga.png" alt="Woman doing yoga" width={221} height={246} style={{ position: 'absolute', left: 0, top: 0 }} />
        <Img src="calm-meditate.png" alt="Man meditating" width={251} height={202} style={{ position: 'absolute', right: 0, bottom: 0 }} />
      </div>
    </Screen>
  )
}

/* ------------------------------------------------------------ Breathing */
export function BreathingList() {
  const navigate = useNavigate()
  return (
    <Screen tabs="calm" footer={<BackButton to="/calm" label="Back to Calming Techniques" />}>
      <h1 className="h1" style={{ marginTop: 16 }}>
        Breathing Exercises
      </h1>
      <div className="stack" style={{ marginTop: 16, gap: 8 }}>
        {BREATHING.map((b) => (
          <button key={b.id} type="button" className="list-btn list-btn--tall" onClick={() => navigate(`/calm/breathing/${b.id}`)}>
            {b.name}
            <ArrowRight />
          </button>
        ))}
      </div>
    </Screen>
  )
}

export function BreathingExercise() {
  const { id } = useParams()
  const ex = BREATHING.find((b) => b.id === id) || BREATHING[0]
  const [running, setRunning] = useState(false)
  const [elapsed, setElapsed] = useState(0)

  useEffect(() => {
    if (!running) return
    const t = setInterval(() => setElapsed((e) => e + 1), 1000)
    return () => clearInterval(t)
  }, [running])

  // Derive phase + countdown from elapsed seconds
  const cycle = ex.pattern.reduce((a, [, d]) => a + d, 0)
  const rounds = Math.floor(elapsed / cycle)
  let pos = elapsed % cycle
  let phase = 0
  while (pos >= ex.pattern[phase][1]) {
    pos -= ex.pattern[phase][1]
    phase++
  }
  const [label, duration] = ex.pattern[phase]
  const count = duration - pos
  const prev = ex.pattern[(phase - 1 + ex.pattern.length) % ex.pattern.length][0]
  const expanded = label === 'Inhale' || (label === 'Hold' && prev === 'Inhale')

  const stop = () => {
    setRunning(false)
    setElapsed(0)
  }

  return (
    <Screen footer={<BackButton to="/calm/breathing" label="Back to Breathing Exercises" />}>
      <h1 className="h1" style={{ marginTop: 16 }}>
        {ex.name}
      </h1>
      <div className="stack" style={{ marginTop: 16, gap: 8 }}>
        <p className="body">{ex.intro}</p>
        {running ? (
          <p className="body">Relax and focus only on your breath. Slow, controlled breathing is best.</p>
        ) : (
          <ul className="steps body">
            {ex.steps.map((s) => (
              <li key={s}>{s}</li>
            ))}
          </ul>
        )}
      </div>

      <div className="stack stack--center" style={{ marginTop: running ? 40 : 26 }}>
        {running ? (
          <>
            <button type="button" className="breath" onClick={stop} aria-label="Stop exercise" aria-live="polite">
              <span
                className="breath__circle"
                style={{
                  transform: `scale(${expanded ? 1 : 0.6})`,
                  transitionDuration: `${label === 'Hold' ? 0.3 : duration}s`,
                }}
              />
              <span className="breath__ring">
                <span className="breath__label">{label}</span>
                <span className="breath__label" style={{ fontSize: 24 }}>
                  {count}
                </span>
              </span>
            </button>
            <p className="small body--muted">Round {rounds + 1} · tap the circle to stop</p>
          </>
        ) : (
          <button type="button" className="round-btn" onClick={() => setRunning(true)}>
            Start
          </button>
        )}
      </div>
    </Screen>
  )
}

/* ---------------------------------------------------------------- Yoga */
export function YogaList() {
  const navigate = useNavigate()
  return (
    <Screen footer={<BackButton to="/calm" label="Back to Calming Techniques" />}>
      <h1 className="h1" style={{ marginTop: 16 }}>
        Yoga Poses
      </h1>
      <div className="stack" style={{ marginTop: 16, gap: 10 }}>
        {YOGA.map((y) => (
          <button key={y.id} type="button" className="list-btn list-btn--tall" onClick={() => navigate(`/calm/yoga/${y.id}`)}>
            {y.name}
            <ArrowRight />
          </button>
        ))}
      </div>
    </Screen>
  )
}

export function YogaDetail() {
  const { id } = useParams()
  const pose = YOGA.find((y) => y.id === id) || YOGA[2]
  return (
    <Screen footer={<BackButton to="/calm/yoga" label="Back to Yoga Poses" />}>
      <h1 className="h1" style={{ marginTop: 16, paddingLeft: 4 }}>
        {pose.name}
      </h1>
      {pose.image && <Img src={pose.image} alt={pose.name} width="100%" height={286} style={{ marginTop: 26 }} />}
      <div className="stack" style={{ marginTop: 26, gap: 8, paddingLeft: 4 }}>
        <h2 className="h2">{pose.tagline}</h2>
        <ul className="steps body">
          {pose.steps.map(([term, text]) => (
            <li key={term}>
              <strong>{term}</strong> - {text}
            </li>
          ))}
        </ul>
      </div>
    </Screen>
  )
}
