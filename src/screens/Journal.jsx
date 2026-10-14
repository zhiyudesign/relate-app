import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Screen, Button, Logo, MoodMeter, MOODS, Modal, TextInput, asset } from '../components/ui'
import { Plus, Close, ArrowRight, StarCircle } from '../components/Icons'
import { useAppState } from '../state'

const fmtDate = (iso) => new Date(iso).toLocaleDateString([], { month: 'short', day: 'numeric' })

function SectionHeader({ title, onAdd, addLabel }) {
  return (
    <div className="app-header">
      <h1 className="h1">{title}</h1>
      {onAdd && (
        <button type="button" className="add-btn" aria-label={addLabel} onClick={onAdd}>
          <Plus />
        </button>
      )}
    </div>
  )
}

/** Mood score 0–100 (very happy = 100, very sad = 0) */
const moodScore = (m) => ((5 - m) / 4) * 100

function MoodCard({ moods }) {
  const recent = moods.slice(-7)
  const avg = recent.length ? Math.round(recent.reduce((a, m) => a + moodScore(m.mood), 0) / recent.length) : 0
  const face = recent.length ? Math.min(5, Math.max(1, Math.round(5 - (avg / 100) * 4))) : 3
  const W = 168
  const H = 54
  const pts = recent.map((m, i) => [
    recent.length === 1 ? W / 2 : (i / (recent.length - 1)) * W,
    H - 4 - (moodScore(m.mood) / 100) * (H - 8),
  ])
  const line = pts.map((p, i) => `${i ? 'L' : 'M'}${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(' ')

  return (
    <div className="card" style={{ flex: 1, minWidth: 0 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <p className="card__label">Mood</p>
          <p className="card__metric">
            {recent.length ? `${avg}%` : '–'}
          </p>
        </div>
        <img src={asset(`mood-${face}.png`)} width="38" height="38" alt={MOODS[face - 1].label} />
      </div>
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" height={H} style={{ marginTop: 12, overflow: 'visible' }} aria-hidden="true">
        {recent.length > 1 && (
          <>
            <path d={`${line} L${W},${H} L0,${H} Z`} fill="var(--bg-green)" opacity="0.7" />
            <path d={line} fill="none" stroke="var(--fill)" strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" />
          </>
        )}
        {!recent.length && <line x1="0" x2={W} y1={H - 2} y2={H - 2} stroke="var(--bg-green)" strokeWidth="2" />}
      </svg>
    </div>
  )
}

function EventsCard({ journal }) {
  // entries per weekday over the last 7 days, Sun → Sat
  const counts = Array(7).fill(0)
  const weekAgo = Date.now() - 7 * 864e5
  journal.forEach((e) => {
    const d = new Date(e.date)
    if (d.getTime() >= weekAgo) counts[d.getDay()]++
  })
  const max = Math.max(1, ...counts)
  return (
    <div className="card" style={{ flex: 1, minWidth: 0 }}>
      <p className="card__label">Event Times</p>
      <p className="card__metric">
        {journal.length}
      </p>
      <div style={{ display: 'flex', alignItems: 'flex-end', gap: 6, height: 44, marginTop: 4 }} aria-hidden="true">
        {counts.map((c, i) => (
          <span
            key={i}
            style={{
              flex: 1,
              height: `${Math.max(8, (c / max) * 100)}%`,
              borderRadius: 3,
              background: c ? 'linear-gradient(180deg, var(--primary), var(--fill))' : 'var(--bg-green)',
            }}
          />
        ))}
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginTop: 4 }}>
        <span>Sun</span>
        <span>Sat</span>
      </div>
    </div>
  )
}

/* ------------------------------------------------------------ Dashboard */
export function JournalDashboard() {
  const navigate = useNavigate()
  const { state } = useAppState()

  return (
    <Screen tabs="journal">
      <SectionHeader title="Mood Analytics" addLabel="Add mood entry" onAdd={() => navigate('/journal/mood')} />
      <div style={{ display: 'flex', gap: 16, marginTop: 8 }}>
        <MoodCard moods={state.moods} />
        <EventsCard journal={state.journal} />
      </div>

      <hr className="hr" style={{ margin: '24px 0 22px' }} />

      <SectionHeader title="Journal Entries" addLabel="Add journal entry" onAdd={() => navigate('/journal/new')} />
      <div className="stack" style={{ gap: 10, marginTop: 20 }}>
        {state.journal.length === 0 && (
          <p className="body body--muted">No entries yet. Tap + to write your first one.</p>
        )}
        {state.journal.map((e) => (
          <button key={e.id} type="button" className="list-btn" onClick={() => navigate(`/journal/entry/${e.id}`)}>
            <StarCircle style={{ color: 'var(--primary)', flexShrink: 0 }} />
            <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{e.title || 'Untitled entry'}</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: 8, fontWeight: 400, fontSize: 14, color: 'var(--dark)' }}>
              {fmtDate(e.date)}
              <ArrowRight style={{ color: 'var(--primary)' }} />
            </span>
          </button>
        ))}
      </div>

      <hr className="hr" style={{ margin: '24px 0 12px' }} />

      <div className="stack">
        <h1 className="h1">Export Data</h1>
        <p className="body">
          Exploring journal entry data would be use to support sharing meaningful, structured insights with therapists
          and psychiatrists for better understanding and care.
        </p>
        <div>
          <Button wide={false} onClick={() => navigate('/journal/export')}>
            Export Data
          </Button>
        </div>
      </div>
    </Screen>
  )
}

/* ------------------------------------------------------------ Add mood */
export function AddMood() {
  const navigate = useNavigate()
  const { state, update } = useAppState()
  const [mood, setMood] = useState(null)

  return (
    <Screen
      footer={
        <Button
          disabled={!mood}
          onClick={() => {
            update((s) => ({ moods: [...s.moods, { date: new Date().toISOString(), mood }] }))
            navigate('/journal/mood/done')
          }}
        >
          Save Entry
        </Button>
      }
    >
      <h1 className="h1" style={{ marginTop: 16 }}>
        Add Mood Entry
      </h1>
      <div className="stack" style={{ marginTop: 16, gap: 8 }}>
        <h2 className="h2">Hi {state.name},</h2>
        <p className="body">
          How are you feeling today? Remember you are doing a great job despite life’s obstacles. Keep going!
        </p>
      </div>
      <div className="stack stack--center" style={{ marginTop: 56, gap: 120 }}>
        <Logo size={200} />
        <MoodMeter value={mood} onChange={setMood} />
      </div>
    </Screen>
  )
}

function Confirmation({ title, body, cta, onCta }) {
  return (
    <Screen footer={<Button onClick={onCta}>{cta}</Button>}>
      <div className="stack stack--center" style={{ marginTop: 147, gap: 64 }}>
        <div className="stack stack--center">
          <h1 className="h1">{title}</h1>
          <p className="body">{body}</p>
        </div>
        <Logo size={200} />
      </div>
    </Screen>
  )
}

export function MoodDone() {
  const navigate = useNavigate()
  return (
    <Confirmation
      title="You Added a Mood Entry"
      body="Your mood entry is successful! Take a look at your mood analytics to track your emotions over time."
      cta="Return to Journal"
      onCta={() => navigate('/journal')}
    />
  )
}

export function JournalDone() {
  const navigate = useNavigate()
  return (
    <Confirmation
      title="You Added a Journal Entry"
      body="Successful journal entry! Remember to read past entries to see your own growth. You’re doing great!"
      cta="Return to Journal"
      onCta={() => navigate('/journal')}
    />
  )
}

/* ------------------------------------------------------- Journal entry */
const CAUSES = [
  'Overthinking what I said',
  'Worry they judged me',
  'Fear I sounded awkward',
  'Feeling I said something wrong',
  'Not knowing what to say',
  'Meeting someone new',
  'Speaking up in class',
  'Proud I showed up',
]

export function JournalEntry() {
  const navigate = useNavigate()
  const { id } = useParams()
  const { state, update } = useAppState()
  const existing = id ? state.journal.find((e) => e.id === id) : null

  const [title, setTitle] = useState(existing?.title || '')
  const [body, setBody] = useState(existing?.body || '')
  const [labels, setLabels] = useState(existing?.labels || [])
  const [mood, setMood] = useState(existing?.mood || null)
  const [confirmDelete, setConfirmDelete] = useState(false)

  const toggle = (l) => setLabels((ls) => (ls.includes(l) ? ls.filter((x) => x !== l) : [...ls, l]))

  const save = () => {
    const entry = {
      id: existing?.id || `j-${Date.now()}`,
      date: existing?.date || new Date().toISOString(),
      title: title.trim() || 'Untitled entry',
      body,
      labels,
      mood: mood || 3,
    }
    update((s) => ({
      journal: existing ? s.journal.map((e) => (e.id === existing.id ? entry : e)) : [entry, ...s.journal],
    }))
    navigate(existing ? '/journal' : '/journal/new/done')
  }

  const remove = () => {
    if (existing) update((s) => ({ journal: s.journal.filter((e) => e.id !== existing.id) }))
    navigate('/journal')
  }

  return (
    <Screen
      footer={
        <div style={{ display: 'flex', gap: 16, width: '100%' }}>
          <Button wide={false} className="btn--full" onClick={save} style={{ flex: 1 }}>
            Save Entry
          </Button>
          <Button variant="secondary" wide={false} style={{ flex: 1 }} onClick={() => (existing || title || body ? setConfirmDelete(true) : navigate('/journal'))}>
            Delete Entry
          </Button>
        </div>
      }
    >
      <div className="app-header" style={{ marginTop: 8 }}>
        <h1 className="h1">{existing ? 'Journal Entry' : 'Add Journal Entry'}</h1>
        <button type="button" className="btn btn--primary btn--icon" style={{ height: 48 }} aria-label="Close" onClick={() => navigate('/journal')}>
          <Close />
        </button>
      </div>
      <h2 className="h2">Document how you are feeling.</h2>

      <div className="stack" style={{ marginTop: 24, gap: 8 }}>
        <TextInput placeholder="Title..." aria-label="Title" value={title} onChange={(e) => setTitle(e.target.value)} />
        <div className="input" style={{ alignItems: 'flex-start' }}>
          <textarea placeholder="Start writing..." aria-label="Entry" value={body} onChange={(e) => setBody(e.target.value)} />
        </div>
      </div>

      <div className="stack" style={{ marginTop: 32, gap: 8 }}>
        <p className="body">What is causing you to feel this way?</p>
        <div
          style={{
            display: 'grid',
            gridTemplateRows: 'repeat(2, auto)',
            gridAutoFlow: 'column',
            gap: 8,
            overflowX: 'auto',
            margin: '0 calc(var(--gutter) * -1)',
            padding: '0 var(--gutter) 4px',
            scrollbarWidth: 'none',
          }}
        >
          {CAUSES.map((c) => (
            <button
              key={c}
              type="button"
              className="chip"
              style={{ whiteSpace: 'nowrap', gap: 6, padding: '14px 10px' }}
              aria-pressed={labels.includes(c)}
              onClick={() => toggle(c)}
            >
              <StarCircle />
              {c}
            </button>
          ))}
        </div>
      </div>

      <div className="stack" style={{ marginTop: 32, gap: 8 }}>
        <p className="small">Add a mood entry by selecting an emoji.</p>
        <MoodMeter value={mood} onChange={setMood} />
      </div>

      {confirmDelete && (
        <Modal
          title="Confirm Deletion"
          onClose={() => setConfirmDelete(false)}
          actions={
            <>
              <Button wide={false} style={{ width: 142 }} onClick={() => setConfirmDelete(false)}>
                Cancel
              </Button>
              <Button wide={false} variant="secondary" style={{ width: 142 }} onClick={remove}>
                Delete
              </Button>
            </>
          }
        >
          Are you sure you want to delete this journal entry? Once you press the delete button, it will be deleted
          immediately. You can’t undo this action.
        </Modal>
      )}
    </Screen>
  )
}

/* ------------------------------------------------------------ Export */
export function ExportData() {
  const navigate = useNavigate()
  const { state } = useAppState()
  const [done, setDone] = useState(false)

  const exportNow = () => {
    const rows = [
      ['type', 'date', 'title', 'mood', 'labels', 'text'],
      ...state.moods.map((m) => ['mood', m.date, '', MOODS[m.mood - 1].label, '', '']),
      ...state.journal.map((e) => ['journal', e.date, e.title, MOODS[(e.mood || 3) - 1].label, e.labels.join('; '), e.body]),
    ]
    const csv = rows.map((r) => r.map((v) => `"${String(v).replace(/"/g, '""')}"`).join(',')).join('\n')
    const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv' }))
    const a = document.createElement('a')
    a.href = url
    a.download = 'relate-journal-export.csv'
    a.click()
    URL.revokeObjectURL(url)
    setDone(true)
  }

  return (
    <Screen
      footer={
        <div style={{ display: 'flex', gap: 16, width: '100%' }}>
          <Button wide={false} style={{ flex: 1 }} onClick={() => navigate('/journal')}>
            {done ? 'Done' : 'No Thanks'}
          </Button>
          <Button variant="secondary" wide={false} style={{ flex: 1 }} onClick={exportNow}>
            Export Now
          </Button>
        </div>
      }
    >
      <div className="stack" style={{ marginTop: 147 }}>
        <h1 className="h1">Export Data</h1>
        <p className="body">
          Explore your journal data to discover patterns in your thoughts, feelings, and behaviors.
        </p>
      </div>
      <div className="stack stack--center" style={{ marginTop: 24 }}>
        <Logo size={200} />
        {done && <p className="body bold" style={{ color: 'var(--primary)' }}>Your file has been downloaded.</p>}
      </div>
    </Screen>
  )
}
