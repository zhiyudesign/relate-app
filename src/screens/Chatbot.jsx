import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Screen, Button, Logo, asset, StatusBar, TabBar } from '../components/ui'
import { Mic, ArrowUp } from '../components/Icons'
import { useAppState } from '../state'

const GOALS = [
  'Learn conversation starters.',
  'Practice mock conversations.',
  'Get actionable encouragement.',
  'Receive social advice.',
]

const PERSONAS = [
  'Mechanical and robotic.',
  'Warm and friendly.',
  'Relatable and joking.',
  'Professional and supportive.',
  'Masculine and assertive.',
  'Feminine and compassionate.',
]

const short = (s) => s.replace(/\.$/, '')

function Header({ right }) {
  return (
    <div className="app-header">
      <h1 className="h1">Relate</h1>
      {right}
    </div>
  )
}

/* -------------------------------------------------------------- Setup */
function OptionGroup({ label, options, value, onChange }) {
  return (
    <div className="stack" style={{ gap: 8 }}>
      <p className="body">{label}</p>
      <div className="options" role="radiogroup" aria-label={label}>
        {options.map((o) => (
          <button key={o} type="button" role="radio" className="option" aria-checked={value === o} onClick={() => onChange(o)}>
            {o}
          </button>
        ))}
      </div>
    </div>
  )
}

export function ChatSetup() {
  const navigate = useNavigate()
  const { state, update } = useAppState()
  const [goal, setGoal] = useState(state.goal)
  const [persona, setPersona] = useState(state.persona)

  return (
    <Screen
      tabs="chatbot"
      footer={
        <Button
          wide={false}
          onClick={() => {
            update({ goal, persona })
            navigate('/chat/intro')
          }}
        >
          Meet Your Chatbot
        </Button>
      }
    >
      <Header />
      <h2 className="h2" style={{ margin: '8px 0 10px' }}>
        Let’s customize your experience.
      </h2>
      <div className="stack stack--xl">
        <OptionGroup label="What is your primary goal?" options={GOALS} value={goal} onChange={setGoal} />
        <OptionGroup label="What personality do you want me to take on?" options={PERSONAS} value={persona} onChange={setPersona} />
      </div>
    </Screen>
  )
}

/* -------------------------------------------------------------- Intro */
export function ChatIntro() {
  const navigate = useNavigate()
  const { state } = useAppState()

  return (
    <Screen tabs="chatbot">
      <Header />
      <p className="meta-row" style={{ marginTop: 4 }}>
        <span>
          <strong>Goal:</strong> {short(state.goal)}
        </span>
        <span>
          <strong>Persona:</strong> {short(state.persona)}
        </span>
      </p>
      <div
        className="stack stack--center"
        style={{
          margin: '24px calc(var(--gutter) * -1) -24px',
          padding: '40px 32px 48px',
          minHeight: 'calc(100% - 64px)',
          borderRadius: '200px 200px 0 0',
          background: 'linear-gradient(180deg, var(--bg-green), #c5df84)',
        }}
      >
        <Logo size={130} variant="logo-sm.svg" />
        <div className="stack" style={{ textAlign: 'left', gap: 16, alignSelf: 'stretch' }}>
          <h2 className="h2">Hi {state.name},</h2>
          <p className="body">
            You have stated your goal is to <strong>{short(state.goal).toLowerCase()}</strong>. Let’s work together to
            achieve it!
          </p>
          <p className="body">
            I will be taking on a <strong>{short(state.persona).toLowerCase()}</strong> personality per your request.
          </p>
        </div>
        <Button wide={false} onClick={() => navigate('/chat')}>
          Continue to Chatbot
        </Button>
      </div>
    </Screen>
  )
}

/* -------------------------------------------------------- Conversation
   Scripted replies that follow the Figma prototype. Anything the visitor
   types gets a friendly generic reply so the demo never dead-ends. */
const STARTERS_REPLY = (
  <>
    <p>Here are short, natural conversation starters for a matcha event:</p>
    <ol>
      <li>“Is this your first time trying matcha?”</li>
      <li>“Do you usually like it sweet or more bitter?”</li>
      <li>“Have you made matcha at home before?”</li>
      <li>“Which one here have you tried so far?”</li>
      <li>“What got you into matcha?”</li>
      <li>“Do you have a favorite café for matcha?”</li>
    </ol>
  </>
)

const SCRIPT = [
  {
    user: 'Give me some conversation starters for a matcha event, please.',
    keywords: ['starter', 'matcha', 'conversation', 'what to say', 'event', 'party'],
    bot: [STARTERS_REPLY],
  },
  {
    user: 'What if it gets awkward?',
    keywords: ['awkward', 'pause', 'silence', 'quiet', 'nervous', 'what if'],
    bot: ['That’s totally okay. If there’s a pause, you can say, ‘Which one here have you tried so far?’ Simple and easy.'],
  },
  {
    user: 'Got it.',
    keywords: ['got it', 'ok', 'okay', 'thanks', 'thank', 'cool', 'great', 'sure'],
    bot: [
      'You’ve got this. Just be curious—people usually enjoy sharing their opinions.',
      'SUMMARY_OFFER',
    ],
  },
]

const FALLBACKS = [
  'That makes sense. Can you tell me a little more about the situation you’re preparing for?',
  'Thanks for sharing that. One small step: pick a single question you could ask, and we can practice it together.',
  'It’s normal to feel that way. Try a slow breath in for 4 and out for 6 — then let’s plan your first line.',
]

function timeNow() {
  return new Date().toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' }).replace(' ', '')
}

export function ChatConversation() {
  const navigate = useNavigate()
  const { state } = useAppState()
  const [messages, setMessages] = useState(() => [
    {
      from: 'bot',
      content: `Hi ${state.name}! I’m Relate. What situation are you getting ready for today?`,
    },
  ])
  const [step, setStep] = useState(0)
  const [typing, setTyping] = useState(false)
  const [draft, setDraft] = useState('')
  const [offerSummary, setOfferSummary] = useState(false)
  const [startedAt] = useState(timeNow)
  const fallbackIdx = useRef(0)
  const bodyRef = useRef(null)

  useEffect(() => {
    const el = bodyRef.current
    if (el) el.scrollTo({ top: el.scrollHeight, behavior: 'smooth' })
  }, [messages, typing, offerSummary])

  const send = (text) => {
    const clean = text.trim()
    if (!clean || typing) return
    setDraft('')
    setMessages((m) => [...m, { from: 'user', content: clean }])

    const scripted = SCRIPT[step]
    let replies
    const lower = clean.toLowerCase()
    if (scripted && (clean === scripted.user || scripted.keywords.some((k) => lower.includes(k)))) {
      // Follow the prototype's script when the message matches the next step.
      replies = scripted.bot
      setStep(step + 1)
    } else {
      replies = [FALLBACKS[fallbackIdx.current++ % FALLBACKS.length]]
    }

    setTyping(true)
    replies.forEach((r, k) => {
      setTimeout(() => {
        if (r === 'SUMMARY_OFFER') {
          setMessages((m) => [
            ...m,
            {
              from: 'bot',
              content: (
                <>
                  Hi {state.name}, if you want, I can help <strong>turn your conversation into a quick summary</strong>.
                </>
              ),
            },
          ])
          setOfferSummary(true)
        } else {
          setMessages((m) => [...m, { from: 'bot', content: r }])
        }
        if (k === replies.length - 1) setTyping(false)
      }, 900 + k * 1100)
    })
  }

  const suggestion = SCRIPT[step]?.user

  return (
    <div className="screen screen--tabs">
      <StatusBar />
      <div style={{ padding: '16px var(--gutter) 8px' }}>
        <div className="app-header">
          <h1 className="h1">Relate</h1>
          <button
            type="button"
            className="btn btn--primary btn--icon"
            aria-label="Change goal and persona"
            title="Change goal and persona"
            onClick={() => navigate('/chat/setup')}
          >
            <span style={{ position: 'relative', width: 27, height: 27, display: 'inline-flex' }}>
              <img src={asset('brain-btn-bg.png')} alt="" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }} />
              <img src={asset('brain.png')} alt="" style={{ position: 'relative', width: 16, height: 16, margin: '6px 6px 5px 5px' }} />
            </span>
          </button>
        </div>
        <p className="meta-row">
          <span>
            <strong>Goal:</strong> {short(state.goal)}
          </span>
          <span>
            <strong>Persona:</strong> {short(state.persona)}
          </span>
        </p>
      </div>

      <div className="screen__body" ref={bodyRef} style={{ padding: 0 }}>
        <div className="chat" aria-live="polite">
          <p className="chat__time">{startedAt}</p>
          {messages.map((m, i) => (
            <div key={i} className={`bubble bubble--${m.from}`}>
              {m.content}
            </div>
          ))}
          {typing && (
            <div className="bubble bubble--bot bubble--typing" aria-label="Relate is typing">
              <span />
              <span />
              <span />
            </div>
          )}
          {offerSummary && !typing && (
            <div style={{ display: 'flex', justifyContent: 'flex-start', paddingLeft: 4 }}>
              <Button wide={false} onClick={() => navigate('/chat/summary')}>
                Summarize Conversation
              </Button>
            </div>
          )}
          {suggestion && !typing && (
            <div className="suggestions">
              <span className="sr-only">Suggested reply:</span>
              <button type="button" onClick={() => send(suggestion)}>
                {suggestion}
              </button>
            </div>
          )}
        </div>
      </div>

      <form
        className="chatbox"
        onSubmit={(e) => {
          e.preventDefault()
          send(draft)
        }}
      >
        <input
          placeholder="Start typing..."
          aria-label="Message"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
        />
        <div className="chatbox__actions">
          <button type="button" className="icon-btn" aria-label="Voice input (demo)" title="Voice input isn’t available in this demo">
            <Mic width={20} height={20} />
          </button>
          <button type="submit" className="icon-btn icon-btn--filled" aria-label="Send" disabled={!draft.trim() || typing}>
            <ArrowUp width={20} height={20} />
          </button>
        </div>
      </form>
      <TabBar active="chatbot" />
    </div>
  )
}


/* -------------------------------------------------------------- Summary */
export const MATCHA_SUMMARY = {
  title: 'Casual Matcha Event Summary',
  body: 'You started with simple, low-pressure questions about matcha (first time, taste preferences), kept the conversation going by asking about their experience, and handled potential awkward moments with easy follow-ups. Overall, you stayed curious, relaxed, and engaged.',
}

export function ChatSummary() {
  const navigate = useNavigate()
  const { update } = useAppState()

  const add = () => {
    update((s) => ({
      journal: [
        {
          id: `chat-${Date.now()}`,
          date: new Date().toISOString(),
          title: MATCHA_SUMMARY.title,
          body: MATCHA_SUMMARY.body,
          labels: ['From chatbot'],
          mood: 2,
        },
        ...s.journal,
      ],
    }))
    navigate('/chat/added')
  }

  return (
    <Screen footer={<Button onClick={add}>Add to Journal</Button>}>
      <h1 className="h1 center" style={{ marginTop: 16 }}>
        Conversation Summary
      </h1>
      <div className="stack stack--lg stack--center" style={{ marginTop: 24 }}>
        <Logo size={130} variant="logo-sm.svg" />
        <div className="stack" style={{ textAlign: 'left' }}>
          <h2 className="h2">{MATCHA_SUMMARY.title}</h2>
          <p className="body">{MATCHA_SUMMARY.body}</p>
        </div>
      </div>
    </Screen>
  )
}

export function ChatAdded() {
  const navigate = useNavigate()
  return (
    <Screen
      footer={
        <>
          <Button onClick={() => navigate('/chat')}>Return to Chatbot</Button>
          <Button variant="secondary" onClick={() => navigate('/journal')}>
            Go to Journal
          </Button>
        </>
      }
    >
      <h1 className="h1 center" style={{ marginTop: 16 }}>
        Journal Entry Added
      </h1>
      <div className="stack stack--lg stack--center" style={{ marginTop: 24 }}>
        <Logo size={130} variant="logo-sm.svg" />
        <div className="stack" style={{ textAlign: 'left' }}>
          <h2 className="h2 center">Success!</h2>
          <p className="body">
            You did really well showing up and trying these conversations. It’s okay if it didn’t feel perfect—what
            matters is that you practiced and kept going. Each small interaction builds your confidence a little more.
            You’re improving more than you think.
          </p>
        </div>
      </div>
    </Screen>
  )
}

