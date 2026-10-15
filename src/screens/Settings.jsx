import { useId, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Screen, Button, Img, Modal, FormField, TextInput, PasswordInput } from '../components/ui'
import { ArrowLeft } from '../components/Icons'
import { useAppState } from '../state'

function BackToSettings() {
  const navigate = useNavigate()
  return (
    <Button wide={false} style={{ minWidth: 198 }} onClick={() => navigate('/settings')}>
      <ArrowLeft width={18} height={18} />
      Back to Settings
    </Button>
  )
}

function Page({ title, children, footer = <BackToSettings /> }) {
  return (
    <Screen footer={footer}>
      <h1 className="h1" style={{ marginTop: 16 }}>
        {title}
      </h1>
      <div style={{ marginTop: 16 }}>{children}</div>
    </Screen>
  )
}

function Toggle({ label, checked, onChange }) {
  const id = useId()
  return (
    <div className="toggle-row">
      <span id={id}>{label}</span>
      <button
        type="button"
        role="switch"
        className="toggle"
        aria-checked={checked}
        aria-labelledby={id}
        onClick={() => onChange(!checked)}
      >
        {checked ? 'Enabled' : 'Disabled'}
        <span className="toggle__track" />
      </button>
    </div>
  )
}

function useSetting() {
  const { state, update } = useAppState()
  const set = (key) => (v) => update((s) => ({ settings: { ...s.settings, [key]: v } }))
  return [state.settings, set]
}

/* ------------------------------------------------------------- Landing */
const ROWS = [
  ['Account', '/settings/account'],
  ['AI Functionality', '/settings/ai'],
  ['Accessibility', '/settings/accessibility'],
  ['Notifications', '/settings/notifications'],
]

export function SettingsHome() {
  const navigate = useNavigate()
  return (
    <Screen tabs="settings">
      <h1 className="h1" style={{ marginTop: 16 }}>
        Settings
      </h1>
      <div className="stack" style={{ marginTop: 16 }}>
        {ROWS.map(([label, to]) => (
          <div key={to} className="input-card" style={{ padding: 0, overflow: 'hidden' }}>
            <button type="button" className="setting-row" onClick={() => navigate(to)}>
              {label}
              <Img src="icon-more-than.png" width={28} height={28} />
            </button>
          </div>
        ))}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginTop: 24 }}>
        <button type="button" className="action-card" onClick={() => navigate('/settings/support')}>
          <Img src="icon-support.png" width={64} height={64} />
          Contact Relate Support
        </button>
        <button type="button" className="action-card" onClick={() => navigate('/settings/resources')}>
          <Img src="icon-resources.png" width={64} height={64} />
          Mental Health Resources
        </button>
      </div>
      <div className="stack stack--center" style={{ marginTop: 20, gap: 4 }}>
        <button type="button" className="legal-link" onClick={() => navigate('/settings/ai-disclosure')}>
          AI DISCLOSURE
        </button>
        <button type="button" className="legal-link" onClick={() => navigate('/settings/privacy')}>
          PRIVACY POLICY
        </button>
      </div>
    </Screen>
  )
}

/* ------------------------------------------------------------- Account */
export function Account() {
  const navigate = useNavigate()
  const { state, update, reset } = useAppState()
  const [name, setName] = useState(state.fullName)
  const [email, setEmail] = useState(state.accountEmail)
  const [current, setCurrent] = useState('')
  const [next, setNext] = useState('')
  const [toast, setToast] = useState('')
  const [confirm, setConfirm] = useState(false)

  const flash = (msg) => {
    setToast(msg)
    setTimeout(() => setToast(''), 2000)
  }

  return (
    <Page title="Account">
      <div className="stack stack--lg">
        <div className="input-card stack">
          <h2 className="h2">Manage Account</h2>
          <div className="field">
            <label className="bold" style={{ fontSize: 18 }} htmlFor="acc-name">
              Name
            </label>
            <TextInput id="acc-name" value={name} onChange={(e) => setName(e.target.value)} onBlur={() => update({ fullName: name })} />
          </div>
          <div className="field">
            <label className="bold" style={{ fontSize: 18 }} htmlFor="acc-email">
              Email
            </label>
            <TextInput id="acc-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} onBlur={() => update({ accountEmail: email })} />
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <Button wide={false} style={{ flex: 1, padding: '14px 8px' }} onClick={() => navigate('/login')}>
              Log Out
            </Button>
            <Button variant="secondary" wide={false} style={{ flex: 1, padding: '14px 8px' }} onClick={() => setConfirm(true)}>
              Delete Account
            </Button>
          </div>
        </div>

        <form
          className="input-card stack"
          onSubmit={(e) => {
            e.preventDefault()
            if (!current || next.length < 8) return flash('Enter your current password and 8+ new characters.')
            setCurrent('')
            setNext('')
            flash('Password updated')
          }}
        >
          <h2 className="h2">Manage Password</h2>
          <div className="field">
            <label className="bold" style={{ fontSize: 18 }} htmlFor="pw-cur">
              Current Password
            </label>
            <PasswordInput id="pw-cur" autoComplete="current-password" value={current} onChange={(e) => setCurrent(e.target.value)} />
          </div>
          <div className="field">
            <label className="bold" style={{ fontSize: 18 }} htmlFor="pw-new">
              New Password
            </label>
            <PasswordInput id="pw-new" autoComplete="new-password" value={next} onChange={(e) => setNext(e.target.value)} />
          </div>
          <Button type="submit" wide={false} style={{ alignSelf: 'flex-start' }}>
            Update Password
          </Button>
        </form>
      </div>

      {toast && <div className="toast">{toast}</div>}

      {confirm && (
        <Modal
          title="Confirm Deletion"
          onClose={() => setConfirm(false)}
          actions={
            <>
              <Button wide={false} style={{ width: 142 }} onClick={() => setConfirm(false)}>
                Cancel
              </Button>
              <Button
                wide={false}
                variant="secondary"
                style={{ width: 142 }}
                onClick={() => {
                  reset()
                  navigate('/')
                }}
              >
                Delete
              </Button>
            </>
          }
        >
          Are you sure you want to delete your account? Once you press the delete button, it will be deleted
          immediately. You will lose all your progress and data. You can’t undo this action.
        </Modal>
      )}
    </Page>
  )
}

/* ------------------------------------------------------- Toggle pages */
export function Accessibility() {
  const [s, set] = useSetting()
  return (
    <Page title="Accessibility">
      <div className="input-card stack" style={{ gap: 0 }}>
        <Toggle label="Dark Mode" checked={s.darkMode} onChange={set('darkMode')} />
        <Toggle label="High Contrast Mode" checked={s.highContrast} onChange={set('highContrast')} />
        <Toggle label="Larger Text" checked={s.largerText} onChange={set('largerText')} />
      </div>
    </Page>
  )
}

export function Notifications() {
  const [s, set] = useSetting()
  return (
    <Page title="Notifications">
      <div className="input-card stack" style={{ gap: 0 }}>
        <Toggle label="Check-In Reminders" checked={s.checkIn} onChange={set('checkIn')} />
        <Toggle label="Journaling Reminders" checked={s.journaling} onChange={set('journaling')} />
        <Toggle label="Mindfulness Reminders" checked={s.mindfulness} onChange={set('mindfulness')} />
        <Toggle label="Positivity Reminders" checked={s.positivity} onChange={set('positivity')} />
      </div>
    </Page>
  )
}

export function AIFunctionality() {
  const [s, set] = useSetting()
  return (
    <Page title="AI Functionality">
      <div className="input-card stack" style={{ gap: 8 }}>
        <p className="body">
          Enable or disable the AI functionality. <strong>The chatbot feature with AR/VR integration will be disabled.</strong>{' '}
          The rest of the app’s features remain available without AI.
        </p>
        <Toggle label="Toggle AI" checked={s.ai} onChange={set('ai')} />
      </div>
    </Page>
  )
}

/* ------------------------------------------------------------- Support */
export function Support() {
  const navigate = useNavigate()
  const { state } = useAppState()
  const [name, setName] = useState(state.fullName)
  const [email, setEmail] = useState(state.accountEmail)
  const [msg, setMsg] = useState('')
  const [tried, setTried] = useState(false)
  const [sent, setSent] = useState(false)

  const send = () => {
    setTried(true)
    if (!name || !email || !msg) return
    setSent(true)
  }

  return (
    <Screen
      footer={
        <>
          {!sent && (
            <Button variant="secondary" onClick={send}>
              Send Email
            </Button>
          )}
          <Button onClick={() => navigate('/settings')}>
            <ArrowLeft width={18} height={18} />
            Back to Settings
          </Button>
        </>
      }
    >
      <h1 className="h1" style={{ marginTop: 16 }}>
        Contact Relate Support
      </h1>
      {sent ? (
        <div className="stack stack--center" style={{ marginTop: 80 }}>
          <h2 className="h2">Message sent!</h2>
          <p className="body">
            Thanks, {name.split(' ')[0]}. Our team will reply to <strong>{email}</strong> as quickly as possible.
          </p>
          <p className="small body--muted">(This is a demo, so no email was actually sent.)</p>
        </div>
      ) : (
        <div className="stack stack--lg" style={{ marginTop: 12 }}>
          <p className="body">
            Need assistance with the Relate app? We can help! Send us an email with your inquiry and we will respond as
            quickly as possible.
          </p>
          <FormField label="Name*" error={tried && !name ? 'Please enter your name.' : null}>
            <TextInput value={name} onChange={(e) => setName(e.target.value)} />
          </FormField>
          <FormField label="Email*" error={tried && !email ? 'Please enter your email.' : null}>
            <TextInput type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          </FormField>
          <FormField label="Message*" error={tried && !msg ? 'Please write a message.' : null}>
            <div className="input" style={{ alignItems: 'flex-start' }}>
              <textarea placeholder="Start writing..." value={msg} onChange={(e) => setMsg(e.target.value)} />
            </div>
          </FormField>
        </div>
      )}
    </Screen>
  )
}

/* ------------------------------------------------------- Text pages */
const HOTLINES = [
  ['National Suicide Prevention', 'Call or text 988, or chat online at 988lifeline.org'],
  ['Crisis Text Line', 'Text “HOME” to 741741'],
  ['RAINN National Sexual Assault Hotline', '1-800-656-4673'],
  ['Domestic Violence Hotline', '1-800-799-7233'],
  ['The Trevor Project TrevorLifeline (LGBTQ+ Youth)', '1-866-488-7386 or text “START” to 678-678'],
  ['Trans Lifeline (Transgender Community)', '1-877-565-8860'],
]

const ONLINE = [
  ['National Institute of Mental Health', 'nimh.nih.gov'],
  ['Anxiety & Depression Association of America', 'adaa.org'],
  ['NAMI (National Alliance on Mental Illness)', 'nami.org'],
]

export function Resources() {
  return (
    <Page title="Mental Health Resources">
      <div className="prose body">
        <p>
          Caring for your mental health is just as important as caring for your physical health, and reaching out early
          can make a meaningful difference in how supported you feel.
        </p>
        <h2 className="h2">24/7 Hotlines</h2>
        <p>
          Crisis hotlines are staffed by trained, real people who listen without judgment and are available 24/7,
          offering immediate support when you need to talk with someone. Here are a few:
        </p>
        <ul>
          {HOTLINES.map(([name, how]) => (
            <li key={name}>
              <strong>{name}:</strong>{' '}
              {/* keep phone numbers on one line */}
              {how.replace(/(\d)-(?=\d)/g, '$1\u2011')}
            </li>
          ))}
        </ul>
        <h2 className="h2">Online Information</h2>
        <p>
          Online mental health information can be helpful, but it’s always best to rely on trusted, evidence-based
          sources and check in with a professional for guidance tailored to you. Here are a few:
        </p>
        <ul>
          {ONLINE.map(([name, url]) => (
            <li key={url}>
              <strong>{name}:</strong>{' '}
              <a href={`https://www.${url}`} target="_blank" rel="noreferrer" style={{ color: 'var(--primary)' }}>
                {url}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </Page>
  )
}

export function AIDisclosure() {
  return (
    <Page title="AI Disclosure">
      <div className="prose body">
        <h2 className="h2" style={{ marginTop: 0 }}>
          AI Usage
        </h2>
        <p>
          AI’s role in the social anxiety app is to provide personalized support, avoid chat exhaustion, and prevent
          emotional manipulation. It is not a replacement for proper therapy. Please seek professional help if needed.
        </p>
        <h2 className="h2">Chatbot Role</h2>
        <p>The chatbot AI is not intended for mentally or emotionally vulnerable individuals.</p>
        <ul>
          <li>Provide personalized guidance.</li>
          <li>Offer words of encouragement.</li>
          <li>Know when to take a break from chatting.</li>
          <li>Add time limit for AI to prevent user AI obsession.</li>
          <li>Context-aware chatbot with sources and disclaimers generate transparency.</li>
          <li>Task-based, input-only chatbot outputs ensure user control over AI.</li>
        </ul>
        <h2 className="h2">Intentional Chatbot Exclusions</h2>
        <ul>
          <li>No sharing personal data.</li>
          <li>No professional medical advice.</li>
          <li>No therapy replacement.</li>
          <li>No streaks or daily tasks.</li>
          <li>No excessively agreeable AI.</li>
          <li>No clingy or tricky language.</li>
          <li>No deceptive therapeutic empathy.</li>
          <li>No manipulative engagement loops.</li>
          <li>No targeted chatbot behavior.</li>
          <li>No similar training datasets.</li>
          <li>No lack of transparency.</li>
        </ul>
      </div>
    </Page>
  )
}

export function Privacy() {
  return (
    <Page title="Privacy Policy">
      <div className="prose body">
        <h2 className="h2" style={{ marginTop: 0 }}>
          Your Data
        </h2>
        <p>
          Personal information such as your email address, mood analytics, chatbot conversations, and journal entries
          accessed by Relate will not be uploaded to a cloud server or large database; the data remains local to the
          app.
        </p>
        <p>
          Only the developers will have access to information you share within the app. Developers partner with the
          security team to ensure no data leaks occur through 24/7 monitoring. Your data will not be used for commercial
          profit. Its use only applies internally with Relate’s private AI infrastructure to potential mental health
          crises.
        </p>
        <h2 className="h2">AI Infrastructure</h2>
        <p>
          Relate’s chatbot runs on a private AI model that is not shared with third-party services. Your conversations
          are never used to train public models or to target advertising.
        </p>
        <p>
          You can turn AI features off at any time in Settings → AI Functionality. Journaling, mood tracking, and
          calming techniques keep working without AI.
        </p>
      </div>
    </Page>
  )
}
