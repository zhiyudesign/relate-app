import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Screen,
  Button,
  Logo,
  Img,
  FormField,
  TextInput,
  PasswordInput,
  SocialLogin,
  ProgressBar,
  MeterDrag,
} from '../components/ui'
import { ArrowRight, ArrowLeft } from '../components/Icons'
import { useAppState } from '../state'

/* ---------------------------------------------------------------- Splash */
export function Splash() {
  const navigate = useNavigate()
  useEffect(() => {
    const t = setTimeout(() => navigate('/features', { replace: true }), 2200)
    return () => clearTimeout(t)
  }, [navigate])

  return (
    <Screen statusBar={false} centered>
      <button
        type="button"
        className="stack stack--center stack--xl"
        style={{ width: 332, maxWidth: '100%' }}
        onClick={() => navigate('/features', { replace: true })}
        aria-label="Start"
      >
        <Logo size={200} />
        <h1 className="h1 h1--xl">Relate</h1>
        <p className="h3">Your friendly AI assistant for social anxiety support.</p>
      </button>
    </Screen>
  )
}

/* ------------------------------------------------------- Features carousel
   Only the first slide's content could be read from Figma so far; add the
   remaining slides here once they're exported. */
const FEATURES = [
  {
    image: 'feature-1.png',
    title: 'Chatbot Personalization',
    body: 'Users can leverage AI chat function to get advice, receive feedback, simulate conversations, and more. Various chatbot personas create user-centered experiences.',
  },
]
const DOT_COUNT = 9

export function Features() {
  const navigate = useNavigate()
  const [i, setI] = useState(0)
  const slide = FEATURES[i]
  const last = FEATURES.length - 1

  return (
    <Screen
      statusBar={false}
      footer={
        <Button onClick={() => navigate('/signup')}>Continue to Sign Up</Button>
      }
    >
      <div className="stack stack--lg" style={{ margin: '47px calc(var(--gutter) * -1) 0', alignItems: 'center' }}>
        <div className="feature-media" key={slide.image}>
          <Img src={slide.image} alt={slide.title} />
        </div>
        <div className="stack" style={{ padding: '0 var(--gutter)', width: '100%' }}>
          <h1 className="h1">Features of Relate</h1>
          <h2 className="h2">{slide.title}</h2>
          <p className="body">{slide.body}</p>
        </div>
      </div>

      <div className="stack stack--lg stack--center" style={{ marginTop: 40 }}>
        <div className="dots" role="tablist" aria-label="Feature slides">
          {Array.from({ length: DOT_COUNT }, (_, d) => (
            <button
              key={d}
              type="button"
              aria-label={`Slide ${d + 1}`}
              aria-current={d === i}
              disabled={d > last}
              onClick={() => setI(d)}
            />
          ))}
        </div>
        <div style={{ display: 'flex', gap: 20, justifyContent: 'center' }}>
          {i > 0 ? (
            <Button className="btn--icon" wide={false} aria-label="Previous" onClick={() => setI(i - 1)}>
              <ArrowLeft />
            </Button>
          ) : (
            <span style={{ width: 72 }} />
          )}
          <Button
            className="btn--icon"
            wide={false}
            aria-label="Next"
            onClick={() => (i < last ? setI(i + 1) : navigate('/signup'))}
          >
            <ArrowRight />
          </Button>
        </div>
      </div>
    </Screen>
  )
}

/* ---------------------------------------------------------------- Auth */
const isEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)

function AuthHeader({ title, headset }) {
  return (
    <div className="stack stack--lg stack--center" style={{ marginTop: 0 }}>
      <span style={{ position: 'relative', display: 'inline-block' }}>
        <Logo size={130} variant="logo-sm.svg" />
        {headset && (
          <Img src="headset.png" width={74} height={73} style={{ position: 'absolute', left: 28, top: 16 }} />
        )}
      </span>
      <h1 className="h1">{title}</h1>
    </div>
  )
}

export function SignUp() {
  const navigate = useNavigate()
  const { state, update } = useAppState()
  const [email, setEmail] = useState(state.email)
  const [password, setPassword] = useState('')
  const [tried, setTried] = useState(false)

  const emailError = tried && !isEmail(email) ? 'Please enter a valid email address.' : null
  const pwError = tried && password.length < 8 ? 'Password must be at least 8 characters.' : null

  const submit = () => {
    setTried(true)
    if (!isEmail(email) || password.length < 8) return
    update({ email })
    navigate('/verify')
  }

  return (
    <Screen
      statusBar={false}
      footer={
        <>
          <Button onClick={submit}>Sign Up</Button>
          <SocialLogin label="or sign up with" onPick={() => navigate('/verify')} />
          <div className="center" style={{ marginTop: 8 }}>
            <p className="body">Already have an account?</p>
            <button type="button" className="link-btn" onClick={() => navigate('/login')}>
              Skip this step and log in!
            </button>
          </div>
        </>
      }
    >
      <form
        className="stack stack--lg"
        style={{ marginTop: 62 }}
        onSubmit={(e) => {
          e.preventDefault()
          submit()
        }}
      >
        <AuthHeader title="Create Account" headset />
        <FormField label="Email*" error={emailError}>
          <TextInput type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} error={emailError} />
        </FormField>
        <FormField label="Password*" error={pwError} info="Use at least 8 characters.">
          <PasswordInput autoComplete="new-password" value={password} onChange={(e) => setPassword(e.target.value)} error={pwError} />
        </FormField>
        <button type="submit" hidden />
      </form>
    </Screen>
  )
}

export function LogIn() {
  const navigate = useNavigate()
  const { state, update } = useAppState()
  const [email, setEmail] = useState(state.email)
  const [password, setPassword] = useState('')
  const [tried, setTried] = useState(false)

  const emailError = tried && !isEmail(email) ? 'Please enter a valid email address.' : null
  const pwError = tried && !password ? 'Please enter your password.' : null

  const submit = () => {
    setTried(true)
    if (!isEmail(email) || !password) return
    update({ email })
    navigate('/chat')
  }

  return (
    <Screen
      statusBar={false}
      footer={
        <>
          <Button onClick={submit}>Log In</Button>
          <SocialLogin label="or continue with" onPick={() => navigate('/chat')} />
          <div className="center" style={{ marginTop: 8 }}>
            <p className="body">Don’t have an account?</p>
            <button type="button" className="link-btn" onClick={() => navigate('/signup')}>
              Create one and sign up!
            </button>
          </div>
        </>
      }
    >
      <form
        className="stack stack--lg"
        style={{ marginTop: 62 }}
        onSubmit={(e) => {
          e.preventDefault()
          submit()
        }}
      >
        <AuthHeader title="Account Login" />
        <FormField label="Email*" error={emailError}>
          <TextInput type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} error={emailError} />
        </FormField>
        <FormField label="Password*" error={pwError}>
          <PasswordInput autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} error={pwError} />
        </FormField>
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: -16 }}>
          <button type="button" className="link-btn">
            Forgot Password
          </button>
        </div>
        <button type="submit" hidden />
      </form>
    </Screen>
  )
}

/* ---------------------------------------------------------------- Verify */
export function VerifyEmail() {
  const navigate = useNavigate()
  const { state } = useAppState()
  const [code, setCode] = useState(Array(6).fill(''))
  const [resent, setResent] = useState(false)
  const refs = useRef([])

  const setDigit = (i, v) => {
    const digits = v.replace(/\D/g, '')
    if (digits.length > 1) {
      // pasted a whole code
      const next = [...code]
      digits
        .slice(0, 6 - i)
        .split('')
        .forEach((d, k) => (next[i + k] = d))
      setCode(next)
      refs.current[Math.min(5, i + digits.length)]?.focus()
      return
    }
    const next = [...code]
    next[i] = digits
    setCode(next)
    if (digits && i < 5) refs.current[i + 1]?.focus()
  }

  const verify = () => {
    const full = code.join('')
    // Demo rule: any 6 digits work, except 000000 which shows the failure screen.
    if (full.length < 6) return refs.current[code.findIndex((c) => !c)]?.focus()
    navigate(full === '000000' ? '/verify/failed' : '/verify/success')
  }

  return (
    <Screen
      footer={
        <>
          <Button onClick={verify}>Verify</Button>
          <Button variant="secondary" onClick={() => navigate('/signup')}>
            Cancel
          </Button>
        </>
      }
    >
      <div className="stack stack--lg stack--center" style={{ marginTop: 49 }}>
        <Logo size={130} variant="logo-verify.svg" />
        <div className="stack stack--center" style={{ width: '100%' }}>
          <h1 className="h1">Verify Email</h1>
          <p className="body" style={{ textAlign: 'left' }}>
            {resent ? 'A new verification code has been sent to ' : 'A verification code has been sent to your email address: '}
            <strong>{state.email || 'you@example.com'}</strong>. Please enter the 6-digit code below.
          </p>
          <div className="otp">
            {code.map((c, i) => (
              <input
                key={i}
                ref={(el) => (refs.current[i] = el)}
                inputMode="numeric"
                autoComplete={i === 0 ? 'one-time-code' : 'off'}
                aria-label={`Digit ${i + 1}`}
                value={c}
                onChange={(e) => setDigit(i, e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Backspace' && !c && i > 0) refs.current[i - 1]?.focus()
                  if (e.key === 'Enter') verify()
                }}
              />
            ))}
          </div>
          <p className="small body--muted" style={{ alignSelf: 'flex-start' }}>
            Demo: any 6 digits work. Enter 000000 to see the failure screen.
          </p>
          <button
            type="button"
            className="link-btn"
            onClick={() => {
              setResent(true)
              setCode(Array(6).fill(''))
              refs.current[0]?.focus()
            }}
          >
            Send another code
          </button>
        </div>
      </div>
    </Screen>
  )
}

function Ring({ children }) {
  return <div className="ring">{children}</div>
}

export function VerifySuccess() {
  const navigate = useNavigate()
  useEffect(() => {
    const t = setTimeout(() => navigate('/survey/1', { replace: true }), 2500)
    return () => clearTimeout(t)
  }, [navigate])

  return (
    <Screen statusBar={false} centered>
      <div className="stack stack--center" style={{ gap: 16 }}>
        <h1 className="h1">Email Verified</h1>
        <p className="body">You will now be directed to the onboarding survey.</p>
        <Ring>
          <Logo size={130} variant="logo-sm.svg" />
        </Ring>
      </div>
    </Screen>
  )
}

export function VerifyFailed() {
  const navigate = useNavigate()
  const { state } = useAppState()
  return (
    <Screen
      statusBar={false}
      footer={
        <>
          <Button onClick={() => navigate('/verify')}>Send Another Code</Button>
          <Button variant="secondary" onClick={() => navigate('/signup')}>
            Use Different Email Address
          </Button>
        </>
      }
    >
      <div className="stack stack--lg stack--center" style={{ marginTop: 111 }}>
        <Logo size={130} variant="logo-sm.svg" />
        <div className="stack stack--center">
          <h1 className="h1">Verification Failure</h1>
          <p className="body">
            Uh oh... something went wrong while verifying your email address:{' '}
            <strong>{state.email || 'you@example.com'}</strong>. Do you want to send another code or use a different
            email address?
          </p>
        </div>
      </div>
    </Screen>
  )
}

/* ---------------------------------------------------------------- Survey */
const SLIDER_QUESTIONS = {
  1: 'How comfortable are you in a small gathering with people you know?',
  2: 'How comfortable are you talking in a classroom setting where group projects are involved?',
  3: 'How comfortable are you talking to someone new?',
}

const Q4_OPTIONS = [
  'Deep breathing or grounding',
  'Scroll TikTok or Instagram',
  'Text a trusted friend',
  'Listen to music',
  'Distract with a simple activity',
  'Remind myself it will pass',
]

const Q5_OPTIONS = [
  'Am I embarrassing myself?',
  'Do I seem weird?',
  'Will I say something stupid?',
  'I don’t know what to say.',
  'I wish this conversation would slow down.',
  'I want this conversation to end already.',
  'I feel really uncomfortable.',
]

function SurveyShell({ step, prompt, instruction, children, cta, onNext }) {
  return (
    <Screen statusBar={false} footer={<Button onClick={onNext}>{cta}</Button>}>
      <div style={{ marginTop: 59 }}>
        <ProgressBar step={step} total={5} />
      </div>
      <div className="stack" style={{ marginTop: 32 }}>
        <h1 className="h1">Question {step} of 5</h1>
        <p className="body" style={{ minHeight: 48 }}>{prompt}</p>
      </div>
      <p className="body body--muted center" style={{ marginTop: 28, marginBottom: 30 }}>
        {instruction}
      </p>
      {children}
    </Screen>
  )
}

export function Survey({ step }) {
  const navigate = useNavigate()
  const { state, update } = useAppState()
  const survey = state.survey
  const set = (patch) => update((s) => ({ survey: { ...s.survey, ...patch } }))
  const next = () => navigate(step < 5 ? `/survey/${step + 1}` : '/getting-started')

  if (step <= 3) {
    const key = `q${step}`
    return (
      <SurveyShell step={step} prompt={SLIDER_QUESTIONS[step]} instruction="Drag the slider to identify." cta="Next Question" onNext={next}>
        <MeterDrag value={survey[key]} onChange={(v) => set({ [key]: v })} />
      </SurveyShell>
    )
  }

  const toggle = (key, opt) =>
    set({ [key]: survey[key].includes(opt) ? survey[key].filter((o) => o !== opt) : [...survey[key], opt] })

  if (step === 4) {
    return (
      <SurveyShell step={4} prompt="How do you comfort yourself?" instruction="Select all that apply." cta="Next Question" onNext={next}>
        <div className="poll-grid">
          {Q4_OPTIONS.map((o) => (
            <button key={o} type="button" className="poll" aria-pressed={survey.q4.includes(o)} onClick={() => toggle('q4', o)}>
              {o}
            </button>
          ))}
        </div>
      </SurveyShell>
    )
  }

  return (
    <SurveyShell
      step={5}
      prompt="Consider the thoughts below. Choose the ones that resonate most with you."
      instruction="Select all that apply."
      cta="Submit Survey"
      onNext={next}
    >
      <div className="stack stack--center" style={{ gap: 8 }}>
        {Q5_OPTIONS.map((o) => (
          <button key={o} type="button" className="chip" aria-pressed={survey.q5.includes(o)} onClick={() => toggle('q5', o)}>
            {o}
          </button>
        ))}
      </div>
    </SurveyShell>
  )
}

export function GettingStarted() {
  const navigate = useNavigate()
  useEffect(() => {
    const t = setTimeout(() => navigate('/chat', { replace: true }), 2600)
    return () => clearTimeout(t)
  }, [navigate])

  return (
    <Screen statusBar={false} centered>
      <div className="stack stack--center" style={{ gap: 8 }}>
        <Ring>
          <Logo size={92} variant="logo-sm.svg" />
        </Ring>
        <h1 className="h1 loading-dots">Getting Started</h1>
      </div>
    </Screen>
  )
}
