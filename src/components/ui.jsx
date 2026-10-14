import { useRef, useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { Signal, Wifi, Battery, ArrowUp, Info, Alert } from './Icons'

/** Path to a file in public/img — relative so it works on GitHub Pages. */
export const asset = (name) => `./img/${name}`

/** Image that shows a soft placeholder until the real asset is added. */
export function Img({ src, alt = '', width, height, cover, round, className = '', style }) {
  const [missing, setMissing] = useState(!src)
  return (
    <span
      className={`img-slot ${cover ? 'img-slot--cover' : ''} ${round ? 'img-slot--round' : ''} ${
        missing ? 'img-slot--missing' : ''
      } ${className}`}
      style={{ width, height, ...style }}
      role={missing && alt ? 'img' : undefined}
      aria-label={missing && alt ? alt : undefined}
    >
      {!missing && <img src={asset(src)} alt={alt} onError={() => setMissing(true)} draggable="false" />}
    </span>
  )
}

export function Logo({ size = 130, variant = 'logo.svg' }) {
  // Figma logo artboard is 200 × 144.6
  return <Img src={variant} alt="Relate logo" width={size} height={Math.round(size * 0.723)} />
}

export function StatusBar() {
  return (
    <div className="status-bar" aria-hidden="true">
      <span>9:41</span>
      <span className="status-bar__icons">
        <Signal />
        <Wifi />
        <Battery />
      </span>
    </div>
  )
}

/**
 * Standard screen shell.
 * - statusBar: show the fake iOS status bar (hidden automatically on real phones)
 * - footer: pinned action area
 * - tabs: show the bottom tab navigation with that tab active
 */
export function Screen({ children, footer, tabs, statusBar = true, centered, className = '', bodyRef }) {
  return (
    <div className={`screen ${tabs ? 'screen--tabs' : ''} ${centered ? 'screen--centered' : ''} ${className}`}>
      {statusBar && <StatusBar />}
      <div className="screen__body" ref={bodyRef}>
        {children}
      </div>
      {footer && <div className="screen__footer">{footer}</div>}
      {tabs && <TabBar active={tabs} />}
    </div>
  )
}

export function Button({ variant = 'primary', wide = true, full, className = '', children, ...rest }) {
  return (
    <button
      type="button"
      className={`btn btn--${variant} ${wide && !full ? 'btn--wide' : ''} ${full ? 'btn--full' : ''} ${className}`}
      {...rest}
    >
      {children}
    </button>
  )
}

// x = centre of each tab on the 402px-wide Figma frame
const TABS = [
  { id: 'arvr', label: 'AR/VR', icon: 'headset.png', to: '/arvr', size: 34, x: 51 },
  { id: 'calm', label: 'Calm', icon: 'tab-calm.png', to: '/calm', size: 32, x: 123 },
  { id: 'chatbot', label: 'Chatbot', icon: 'tab-brain.png', mask: 'tab-brain-mask.png', to: '/chat', size: 32, x: 201 },
  { id: 'journal', label: 'Journal', icon: 'tab-journal.png', to: '/journal', size: 32, x: 279 },
  { id: 'settings', label: 'Settings', icon: 'tab-settings.png', to: '/settings', size: 32, x: 351 },
]

/** An icon PNG used as a mask and filled with the green→orange brand gradient. */
export function GradientIcon({ src, size = 48 }) {
  const mask = `url(${asset(src)}) center / contain no-repeat`
  return (
    <span
      aria-hidden="true"
      style={{
        display: 'block',
        width: size,
        height: size,
        background: 'linear-gradient(90deg, var(--primary), var(--orange))',
        WebkitMask: mask,
        mask,
      }}
    />
  )
}

export function TabBar({ active }) {
  const navigate = useNavigate()
  const cur = TABS.find((t) => t.id === active)
  return (
    <nav className="tabbar" aria-label="Main">
      <svg className="tabbar__bg" viewBox="0 0 402 132" preserveAspectRatio="none" aria-hidden="true">
        <defs>
          <linearGradient id="tabbar-grad" x1="0" y1="0" x2="402" y2="0" gradientUnits="userSpaceOnUse">
            <stop stopColor="#FEC166" />
            <stop offset="1" stopColor="#D8ECA6" />
          </linearGradient>
        </defs>
        <rect x="0" y="23" width="402" height="120" rx="10" fill="url(#tabbar-grad)" />
        {cur && <ellipse cx={cur.x} cy="50" rx="46" ry="50" fill="url(#tabbar-grad)" />}
      </svg>
      <div className="tabbar__items">
        {TABS.map((t) => {
          const on = active === t.id
          return (
            <button
              key={t.id}
              type="button"
              className={`tab ${on ? 'tab--active' : ''}`}
              style={{ left: `${(t.x / 402) * 100}%` }}
              aria-current={on ? 'page' : undefined}
              onClick={() => navigate(t.to)}
            >
              <span className="tab__icon">
                {on ? <GradientIcon src={t.mask || t.icon} size={48} /> : <Img src={t.icon} width={t.size} height={t.size} />}
              </span>
              {t.label}
            </button>
          )
        })}
      </div>
    </nav>
  )
}

export function ProgressBar({ step, total }) {
  return (
    <div className="progress" role="progressbar" aria-valuemin={0} aria-valuemax={total} aria-valuenow={step}>
      <div className="progress__fill" style={{ width: `${(step / total) * 100}%` }} />
    </div>
  )
}

const METER_LABELS = ['Very uncomfortable', 'Uncomfortable', 'Neutral', 'Comfortable', 'Very comfortable']

/** Vertical drag meter (survey questions 1–3). value is 0–100. */
export function MeterDrag({ value, onChange }) {
  const ref = useRef(null)

  const setFromEvent = (e) => {
    const rect = ref.current.getBoundingClientRect()
    const y = Math.min(Math.max(e.clientY - rect.top, 0), rect.height)
    onChange(Math.round(100 - (y / rect.height) * 100))
  }

  const onPointerDown = (e) => {
    ref.current.setPointerCapture(e.pointerId)
    setFromEvent(e)
  }

  const onKeyDown = (e) => {
    if (e.key === 'ArrowUp') onChange(Math.min(100, value + 5))
    if (e.key === 'ArrowDown') onChange(Math.max(0, value - 5))
  }

  const label = METER_LABELS[Math.min(4, Math.floor(value / 20))]

  return (
    <div className="stack stack--center" style={{ gap: 12 }}>
      <div
        ref={ref}
        className="meter"
        role="slider"
        tabIndex={0}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={value}
        aria-valuetext={label}
        onPointerDown={onPointerDown}
        onPointerMove={(e) => e.buttons && setFromEvent(e)}
        onKeyDown={onKeyDown}
      >
        <div className="meter__fill" style={{ height: `calc(${value}% + 1px)`, borderRadius: value > 85 ? 100 : undefined }} />
        <span className="meter__arrow" style={{ top: `calc(${100 - value}% - 24px)` }}>
          <ArrowUp width={32} height={32} />
        </span>
        <span className="meter__handle" style={{ top: `${100 - value}%` }} />
      </div>
      <p className="meter__label" aria-hidden="true">
        {label}
      </p>
    </div>
  )
}

export const MOODS = [
  { id: 1, label: 'Very happy', icon: 'mood-1' },
  { id: 2, label: 'Happy', icon: 'mood-2' },
  { id: 3, label: 'Neutral', icon: 'mood-3' },
  { id: 4, label: 'Sad', icon: 'mood-4' },
  { id: 5, label: 'Very sad', icon: 'mood-5' },
]

export function MoodMeter({ value, onChange }) {
  return (
    <div className="mood-meter" role="radiogroup" aria-label="Mood">
      {MOODS.map((m) => (
        <button
          key={m.id}
          type="button"
          className="mood"
          role="radio"
          aria-checked={value === m.id}
          aria-label={m.label}
          onClick={() => onChange(m.id)}
        >
          <img src={asset(`${m.icon}${value === m.id ? '-on' : ''}.png`)} alt="" />
        </button>
      ))}
    </div>
  )
}

export function FormField({ label, error, info, children }) {
  return (
    <div className="field">
      <label className="h2">{label}</label>
      {children}
      {info && !error && (
        <p className="hint">
          <Info width={24} height={24} style={{ color: 'var(--fill)' }} />
          {info}
        </p>
      )}
      {error && (
        <p className="hint hint--error">
          <Alert width={24} height={24} />
          {error}
        </p>
      )}
    </div>
  )
}

export function TextInput({ error, ...rest }) {
  return (
    <div className={`input ${error ? 'input--error' : ''}`}>
      <input placeholder="Type..." {...rest} />
    </div>
  )
}

export function PasswordInput({ error, ...rest }) {
  const [show, setShow] = useState(false)
  return (
    <div className={`input ${error ? 'input--error' : ''}`}>
      <input type={show ? 'text' : 'password'} placeholder="Type..." {...rest} />
      <button
        type="button"
        className="icon-toggle"
        aria-label={show ? 'Hide password' : 'Show password'}
        onClick={() => setShow((s) => !s)}
      >
        <img src={asset(show ? 'eye-off.svg' : 'eye.svg')} width="24" height="24" alt="" />
      </button>
    </div>
  )
}

/** "or sign up with" divider + Google / Apple buttons */
export function SocialLogin({ label, onPick }) {
  return (
    <div className="stack stack--center" style={{ width: '100%' }}>
      <p className="divider-text">{label}</p>
      <div style={{ display: 'flex', gap: 64 }}>
        <button type="button" className="social-btn" aria-label="Continue with Google" onClick={onPick}>
          <img src={asset('google.png')} width="24" height="24" alt="" />
        </button>
        <button type="button" className="social-btn" aria-label="Continue with Apple" onClick={onPick}>
          <img src={asset('apple.png')} width="24" height="24" alt="" />
        </button>
      </div>
    </div>
  )
}

export function Modal({ title, children, actions, onClose }) {
  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" role="dialog" aria-modal="true" aria-label={title} onClick={(e) => e.stopPropagation()}>
        <h2 className="h2" style={{ display: 'flex', gap: 8, justifyContent: 'center', alignItems: 'center' }}>
          <Alert width={20} height={20} style={{ color: 'var(--red)' }} />
          {title}
        </h2>
        <div className="body">{children}</div>
        <div style={{ display: 'flex', gap: 24, justifyContent: 'center' }}>{actions}</div>
      </div>
    </div>
  )
}

export function useBack() {
  const navigate = useNavigate()
  const location = useLocation()
  return (fallback) => (location.key !== 'default' ? navigate(-1) : navigate(fallback))
}
