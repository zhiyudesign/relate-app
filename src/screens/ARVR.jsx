import { useEffect, useRef, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { Screen, Button, Img, asset, GradientIcon } from '../components/ui'
import { ArrowLeft, ArrowRight, ArrowUp } from '../components/Icons'
import { useAppState } from '../state'

const SCENES = ['BADM', 'AUST', 'ARTB', 'BISH', 'MCHU', 'CAST', 'YNG']

function Title({ children }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 16 }}>
      <Img src="headset-dark.png" width={32} height={31} />
      <h1 className="h1">{children}</h1>
    </div>
  )
}

function AIOff() {
  const navigate = useNavigate()
  return (
    <Screen tabs="arvr">
      <Title>Mock Practice</Title>
      <div className="stack stack--center" style={{ marginTop: 80 }}>
        <Img src="vr-glasses.png" width={206} height={88} />
        <h2 className="h2">AI features are turned off</h2>
        <p className="body">Mock practice uses the Relate chatbot. Turn AI back on to start a session.</p>
        <Button onClick={() => navigate('/settings/ai')}>Open AI Settings</Button>
      </div>
    </Screen>
  )
}

/* ------------------------------------------------------------- Landing */
export function PracticeLanding() {
  const navigate = useNavigate()
  const { state } = useAppState()
  const [params] = useSearchParams()
  const [ended, setEnded] = useState(params.get('ended') === '1')
  useEffect(() => {
    if (!ended) return
    const t = setTimeout(() => setEnded(false), 2500)
    return () => clearTimeout(t)
  }, [ended])
  if (!state.settings.ai) return <AIOff />
  return (
    <Screen tabs="arvr">
      <Title>Mock Practice</Title>
      <div className="stack" style={{ marginTop: 16, gap: 8 }}>
        <button type="button" className="practice-card" onClick={() => navigate('/arvr/environment?type=Lecture')}>
          <img src={asset('arvr-lecture.jpg')} alt="" />
          <span>Lecture</span>
        </button>
        <button type="button" className="practice-card" onClick={() => navigate('/arvr/environment?type=Public')}>
          <img src={asset('arvr-public.jpg')} alt="" />
          <span>Public</span>
        </button>
      </div>
      <div className="stack stack--center" style={{ marginTop: 'max(48px, 22vh)' }}>
        <Img src="vr-glasses.png" alt="VR headset" width={206} height={88} />
      </div>
      {ended && <div className="toast">Session ended. Great practice!</div>}
    </Screen>
  )
}

/* --------------------------------------------------------- Environment */
export function SelectEnvironment() {
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const type = params.get('type') || 'Lecture'
  return (
    <Screen
      footer={
        <Button wide={false} style={{ minWidth: 238 }} onClick={() => navigate('/arvr')}>
          <ArrowLeft width={18} height={18} />
          Back to Mock Practice
        </Button>
      }
    >
      <Title>Select Environment</Title>
      <p className="small body--muted" style={{ margin: '4px 0 12px' }}>
        {type} spaces on campus
      </p>
      <div className="scene-grid">
        {SCENES.map((s, i) => (
          <button key={s} type="button" className="scene" onClick={() => navigate(`/arvr/device?scene=${s}&type=${type}`)}>
            <img src={asset(`scene-${i + 1}.jpg`)} alt={`${s} room`} />
            <span className="scene__tag">
              {s}
              <ArrowRight width={18} height={18} />
            </span>
          </button>
        ))}
      </div>
    </Screen>
  )
}

/* -------------------------------------------------------------- Device */
export function SelectDevice() {
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const scene = params.get('scene') || 'AUST'
  const type = params.get('type') || 'Lecture'
  return (
    <Screen
      footer={
        <Button wide={false} style={{ minWidth: 238 }} onClick={() => navigate(`/arvr/environment?type=${type}`)}>
          <ArrowLeft width={18} height={18} />
          Back to Select a Scene
        </Button>
      }
    >
      <Title>Select Device</Title>
      <div className="stack" style={{ marginTop: 16, gap: 8 }}>
        <button type="button" className="device-card" onClick={() => navigate(`/arvr/vr?scene=${scene}`)}>
          <span className="device-card__label">VR</span>
          <ArrowUpRight />
          <img src={asset('device-vr.png')} alt="Person wearing a VR headset" />
        </button>
        <button type="button" className="device-card" onClick={() => navigate(`/arvr/ar?scene=${scene}`)}>
          <span className="device-card__label">AR</span>
          <ArrowUpRight />
          <img src={asset('device-ar.png')} alt="Hand holding a phone" style={{ width: '137%', left: '-45%', top: -6 }} />
        </button>
      </div>
    </Screen>
  )
}

const ArrowUpRight = () => (
  <svg className="device-card__arrow" width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M7 17 17 7M8 7h9v9" />
  </svg>
)

/* --------------------------------------------------------- Simulations */
const FEEDBACK = [
  'Nice start, try slowing down a little.',
  'Maybe simplify that in one clear sentence.',
  'Great pacing! Try looking toward the back row as you speak.',
  'You’re doing well. Take a breath before your next point.',
  'That was clear and confident. Keep going!',
]

const SCRIPT = {
  title: 'Group Project Update',
  paras: [
    'Hi everyone, I’m presenting our team’s progress on the campus survey project.',
    'So far we collected 120 responses. The biggest finding is that most students study in the library between 6 and 9 PM.',
    'Next week we’ll finish the analysis and share our recommendations. Thank you, and I’m happy to take questions.',
  ],
}

/** Draggable 360° panorama that loops horizontally. */
function usePan() {
  const [x, setX] = useState(0)
  const [moved, setMoved] = useState(false)
  const start = useRef(null)
  const handlers = {
    onPointerDown: (e) => {
      if (e.target.closest('button, input, .sim__chat, .sim__notes, .script-picker')) return
      start.current = { px: e.clientX, x }
      e.currentTarget.setPointerCapture(e.pointerId)
    },
    onPointerMove: (e) => {
      if (!start.current) return
      setX(start.current.x + (e.clientX - start.current.px))
      if (!moved) setMoved(true)
    },
    onPointerUp: () => (start.current = null),
    onPointerCancel: () => (start.current = null),
  }
  return { x, moved, handlers }
}

function useFeedbackChat() {
  const [log, setLog] = useState([{ from: 'bot', text: 'Hi! Start whenever you’re ready. Type what you plan to say and I’ll give you feedback.' }])
  const [draft, setDraft] = useState('')
  const i = useRef(0)
  const send = () => {
    const t = draft.trim()
    if (!t) return
    setDraft('')
    setLog((l) => [...l, { from: 'user', text: t }])
    setTimeout(() => setLog((l) => [...l, { from: 'bot', text: FEEDBACK[i.current++ % FEEDBACK.length] }]), 800)
  }
  return { log, draft, setDraft, send }
}

function ChatPanel({ chat, style, header }) {
  const logRef = useRef(null)
  useEffect(() => {
    logRef.current?.scrollTo({ top: logRef.current.scrollHeight, behavior: 'smooth' })
  }, [chat.log])
  return (
    <div className="sim__chat glass" style={style}>
      {header}
      <div className="sim__chat-log" ref={logRef} aria-live="polite">
        {chat.log.map((m, k) => (
          <div key={k} className={`bubble bubble--${m.from}`}>
            {m.text}
          </div>
        ))}
      </div>
      <form
        className="sim__input"
        onSubmit={(e) => {
          e.preventDefault()
          chat.send()
        }}
      >
        <input placeholder="Start typing..." aria-label="Message" value={chat.draft} onChange={(e) => chat.setDraft(e.target.value)} />
        <img src={asset('icon-mic.png')} width="20" height="20" alt="" />
        <button type="submit" className="sim__send" aria-label="Send">
          <ArrowUp width={18} height={18} />
        </button>
      </form>
    </div>
  )
}

function RotateHint() {
  const [hide, setHide] = useState(false)
  if (hide) return null
  return (
    <div className="rotate-hint">
      <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
        <rect x="7" y="2" width="10" height="20" rx="2" />
        <path d="M21 12a9 9 0 0 1-4 7.5M3 12a9 9 0 0 1 4-7.5" />
      </svg>
      <p className="body bold">Turn your phone sideways for the best view.</p>
      <Button variant="secondary" wide={false} onClick={() => setHide(true)}>
        Continue anyway
      </Button>
    </div>
  )
}

export function VRSimulation() {
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const scene = params.get('scene') || 'AUST'
  const { x, moved, handlers } = usePan()
  const chat = useFeedbackChat()
  const [showChat, setShowChat] = useState(true)
  const [picker, setPicker] = useState(false)
  const [script, setScript] = useState(null)

  return (
    <div className="sim" {...handlers}>
      <div className="sim__pano" style={{ backgroundImage: `url(${asset('pano-vr.jpg')})`, backgroundPositionX: x }} />
      {!moved && <img className="sim__hint" src={asset('icon-360.png')} alt="" style={{ width: 150, opacity: 0.8 }} />}
      <div className="sim__toast" style={{ top: 10 }}>
        VR · {scene}
      </div>

      {showChat && (
        <ChatPanel
          chat={chat}
          style={{ left: 50, top: 46, width: 250, height: 270 }}
          header={
            <p style={{ padding: '10px 14px 0', fontFamily: 'var(--font-heading)', fontWeight: 800, color: '#3a5906' }}>Relate</p>
          }
        />
      )}

      {script && (
        <div className="sim__notes glass" style={{ right: 50, top: 70, width: 190, maxHeight: 190 }}>
          <h3>{script}</h3>
          {SCRIPT.paras.map((p) => (
            <p key={p}>{p}</p>
          ))}
        </div>
      )}

      <div className="sim__dock" style={{ left: 120, bottom: 22 }}>
        <button type="button" aria-label="Show chatbot" aria-pressed={showChat} onClick={() => setShowChat((v) => !v)}>
          <GradientIcon src="tab-brain-mask.png" size={34} />
        </button>
        <button type="button" aria-label="Add script" aria-pressed={picker || !!script} onClick={() => setPicker(true)}>
          <GradientIcon src="icon-document.png" size={34} />
        </button>
      </div>

      <button type="button" className="sim__end" style={{ right: 40, bottom: 26 }} onClick={() => navigate('/arvr?ended=1')}>
        End Session
      </button>

      {picker && (
        <>
          <div className="sim__dim" onClick={() => setPicker(false)} />
          <div className="script-picker" role="dialog" aria-label="Input Script">
            <h2>Input Script</h2>
            <div className="script-picker__opts">
              {[
                ['Microsoft Word', 'icon-word.png'],
                ['Google Docs', 'icon-gdocs.png'],
                ['File', 'icon-file.png'],
              ].map(([label, icon]) => (
                <button
                  key={label}
                  type="button"
                  onClick={() => {
                    setScript(`${SCRIPT.title} (${label})`)
                    setPicker(false)
                  }}
                >
                  <img src={asset(icon)} width="56" height="56" alt="" />
                  {label}
                </button>
              ))}
            </div>
          </div>
        </>
      )}
      <RotateHint />
    </div>
  )
}

export function ARSimulation() {
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const scene = params.get('scene') || 'AUST'
  const { x, moved, handlers } = usePan()
  const chat = useFeedbackChat()
  const [showChat, setShowChat] = useState(false)

  return (
    <div className="sim" {...handlers}>
      <div className="sim__pano" style={{ backgroundImage: `url(${asset('pano-ar.jpg')})`, backgroundPositionX: x }} />
      {!moved && <img className="sim__hint" src={asset('icon-360.png')} alt="Drag to look around" />}
      <div className="sim__toast" style={{ top: 10 }}>
        AR · {scene}
      </div>

      <button type="button" className="sim__end" style={{ left: 22, top: 27 }} onClick={() => navigate('/arvr?ended=1')}>
        End Session
      </button>

      {!showChat && (
        <button type="button" className="sim__brain-btn" aria-label="Open chatbot" onClick={() => setShowChat(true)}>
          <span>
            <GradientIcon src="tab-brain-mask.png" size={30} />
          </span>
        </button>
      )}

      {showChat && (
        <ChatPanel
          chat={chat}
          style={{ right: 0, top: 0, bottom: 0, width: 214, borderRadius: '16px 0 0 16px' }}
          header={
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 10px 0 18px' }}>
              <p style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: 12, color: '#3a5906' }}>Relate</p>
              <button type="button" aria-label="Close chatbot" onClick={() => setShowChat(false)}>
                <img src={asset('icon-close.png')} width="36" height="36" alt="" />
              </button>
            </div>
          }
        />
      )}
      <RotateHint />
    </div>
  )
}
