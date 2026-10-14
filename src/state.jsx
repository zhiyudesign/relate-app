import { createContext, useContext, useEffect, useState } from 'react'

const KEY = 'relate-demo-v2'

const SEED = {
  email: '',
  name: 'Levi',
  survey: { q1: 60, q2: 60, q3: 60, q4: [], q5: [] },
  goal: 'Learn conversation starters.',
  persona: 'Warm and friendly.',
  moods: [
    { date: daysAgo(6), mood: 2 },
    { date: daysAgo(5), mood: 3 },
    { date: daysAgo(4), mood: 2 },
    { date: daysAgo(3), mood: 4 },
    { date: daysAgo(2), mood: 2 },
    { date: daysAgo(1), mood: 1 },
  ],
  journal: [
    {
      id: 'seed-1',
      date: daysAgo(1),
      title: 'The Matcha Event',
      body: 'Went to the matcha tasting and used two of the conversation starters. It felt awkward for a second, but asking “Which one have you tried so far?” kept things going.',
      labels: ['Fear I sounded awkward'],
      mood: 2,
    },
    {
      id: 'seed-2',
      date: daysAgo(3),
      title: 'Financial Class Presentation',
      body: 'Presented my section of the group project. My hands were shaking, but nobody seemed to notice and my teammates said I did well.',
      labels: ['Overthinking what I said', 'Worry they judged me'],
      mood: 3,
    },
    {
      id: 'seed-3',
      date: daysAgo(5),
      title: 'Career Fairs',
      body: 'Talked to three recruiters. Practiced my intro beforehand which really helped.',
      labels: ['Proud I showed up'],
      mood: 1,
    },
  ],
}

function daysAgo(n) {
  const d = new Date()
  d.setDate(d.getDate() - n)
  return d.toISOString()
}

function load() {
  try {
    const raw = localStorage.getItem(KEY)
    return raw ? { ...SEED, ...JSON.parse(raw) } : SEED
  } catch {
    return SEED
  }
}

const Ctx = createContext(null)

export function AppStateProvider({ children }) {
  const [state, setState] = useState(load)

  useEffect(() => {
    try {
      localStorage.setItem(KEY, JSON.stringify(state))
    } catch {
      /* storage unavailable — keep in memory only */
    }
  }, [state])

  const update = (patch) => setState((s) => ({ ...s, ...(typeof patch === 'function' ? patch(s) : patch) }))
  const reset = () => setState(SEED)

  return <Ctx.Provider value={{ state, update, reset }}>{children}</Ctx.Provider>
}

export const useAppState = () => useContext(Ctx)
