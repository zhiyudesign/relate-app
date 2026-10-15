import { Routes, Route, Navigate, useNavigate, useLocation, useParams } from 'react-router-dom'
import { useAppState } from './state'
import * as O from './screens/Onboarding'
import * as C from './screens/Chatbot'
import * as J from './screens/Journal'
import * as K from './screens/Calm'
import * as A from './screens/ARVR'
import * as S from './screens/Settings'

// Links shown beside the phone on desktop — edit these for your portfolio.
const LINKS = {
  figma: 'https://www.figma.com/proto/jzCqAWExPS6Uxzjm3PvioO/DMD3035_SocialAnxietyAPP_Design?node-id=952-23465&starting-point-node-id=952%3A23465',
  github: 'https://github.com/zhiyudesign/relate-app',
}

const JUMP = [
  ['Onboarding', '/'],
  ['Survey', '/survey/1'],
  ['Chatbot', '/chat'],
  ['Journal', '/journal'],
  ['Calm', '/calm'],
  ['AR/VR', '/arvr'],
  ['Settings', '/settings'],
]

function Showcase({ children }) {
  const navigate = useNavigate()
  const { state, reset } = useAppState()
  const { pathname } = useLocation()
  const landscape = pathname === '/arvr/vr' || pathname === '/arvr/ar'
  const s = state.settings
  return (
    <div className="showcase">
      <aside className="showcase__info">
        <h1>Relate</h1>
        <p>Your friendly AI assistant for social anxiety support.</p>
        <p className="muted">
          An interactive prototype coded from my high-fidelity Figma design. Click through it like a real app — or open
          this page on your phone for the full-screen experience.
        </p>
        <p className="muted" style={{ fontWeight: 700, marginTop: 24, marginBottom: 8 }}>
          Jump to a flow
        </p>
        <div className="showcase__links" style={{ marginTop: 0 }}>
          {JUMP.map(([label, to]) => (
            <button key={to} type="button" onClick={() => navigate(to)}>
              {label}
            </button>
          ))}
        </div>
        <div className="showcase__links">
          {LINKS.figma && (
            <a href={LINKS.figma} target="_blank" rel="noreferrer">
              Figma prototype ↗
            </a>
          )}
          {LINKS.github && (
            <a href={LINKS.github} target="_blank" rel="noreferrer">
              Source on GitHub ↗
            </a>
          )}
          <button
            type="button"
            onClick={() => {
              reset()
              navigate('/')
            }}
          >
            Reset demo
          </button>
        </div>
      </aside>
      <div className={`phone ${landscape ? 'phone--landscape' : ''}`}>
        <div className="phone__screen" data-dark={s.darkMode} data-contrast={s.highContrast} data-large={s.largerText}>
          <span className="phone__island" />
          {children}
        </div>
      </div>
    </div>
  )
}

function SurveyRoute() {
  const { step } = useParams()
  const n = Number(step)
  if (!(n >= 1 && n <= 5)) return <Navigate to="/survey/1" replace />
  return <O.Survey key={n} step={n} />
}

export default function App() {
  const location = useLocation()
  return (
    <Showcase>
      <Routes location={location} key={location.pathname}>
        {/* Onboarding */}
        <Route path="/" element={<O.Splash />} />
        <Route path="/features" element={<O.Features />} />
        <Route path="/signup" element={<O.SignUp />} />
        <Route path="/login" element={<O.LogIn />} />
        <Route path="/verify" element={<O.VerifyEmail />} />
        <Route path="/verify/success" element={<O.VerifySuccess />} />
        <Route path="/verify/failed" element={<O.VerifyFailed />} />
        <Route path="/survey/:step" element={<SurveyRoute />} />
        <Route path="/getting-started" element={<O.GettingStarted />} />

        {/* Chatbot */}
        <Route path="/chat/setup" element={<C.ChatSetup />} />
        <Route path="/chat/intro" element={<C.ChatIntro />} />
        <Route path="/chat" element={<C.ChatConversation />} />
        <Route path="/chat/summary" element={<C.ChatSummary />} />
        <Route path="/chat/added" element={<C.ChatAdded />} />

        {/* Journal & mood */}
        <Route path="/journal" element={<J.JournalDashboard />} />
        <Route path="/journal/mood" element={<J.AddMood />} />
        <Route path="/journal/mood/done" element={<J.MoodDone />} />
        <Route path="/journal/new" element={<J.JournalEntry />} />
        <Route path="/journal/new/done" element={<J.JournalDone />} />
        <Route path="/journal/entry/:id" element={<J.JournalEntry />} />
        <Route path="/journal/export" element={<J.ExportData />} />

        {/* Calming techniques */}
        <Route path="/calm" element={<K.CalmLanding />} />
        <Route path="/calm/breathing" element={<K.BreathingList />} />
        <Route path="/calm/breathing/:id" element={<K.BreathingExercise />} />
        <Route path="/calm/yoga" element={<K.YogaList />} />
        <Route path="/calm/yoga/:id" element={<K.YogaDetail />} />

        {/* AR / VR mock practice */}
        <Route path="/arvr" element={<A.PracticeLanding />} />
        <Route path="/arvr/environment" element={<A.SelectEnvironment />} />
        <Route path="/arvr/device" element={<A.SelectDevice />} />
        <Route path="/arvr/vr" element={<A.VRSimulation />} />
        <Route path="/arvr/ar" element={<A.ARSimulation />} />

        {/* Settings */}
        <Route path="/settings" element={<S.SettingsHome />} />
        <Route path="/settings/account" element={<S.Account />} />
        <Route path="/settings/ai" element={<S.AIFunctionality />} />
        <Route path="/settings/accessibility" element={<S.Accessibility />} />
        <Route path="/settings/notifications" element={<S.Notifications />} />
        <Route path="/settings/support" element={<S.Support />} />
        <Route path="/settings/resources" element={<S.Resources />} />
        <Route path="/settings/ai-disclosure" element={<S.AIDisclosure />} />
        <Route path="/settings/privacy" element={<S.Privacy />} />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Showcase>
  )
}
