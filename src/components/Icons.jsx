// Generic UI icons (Simple Design System / Feather style used in the Figma file).
const base = {
  width: 24,
  height: 24,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 2,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  'aria-hidden': true,
}

export const ArrowRight = (p) => (
  <svg {...base} {...p}>
    <path d="M5 12h14M12 5l7 7-7 7" />
  </svg>
)

export const ArrowLeft = (p) => (
  <svg {...base} {...p}>
    <path d="M19 12H5M12 19l-7-7 7-7" />
  </svg>
)

export const ArrowUp = (p) => (
  <svg {...base} {...p}>
    <path d="M12 19V5M5 12l7-7 7 7" />
  </svg>
)

export const ChevronRight = (p) => (
  <svg {...base} {...p}>
    <path d="M9 18l6-6-6-6" />
  </svg>
)

export const Mic = (p) => (
  <svg {...base} {...p}>
    <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
    <path d="M19 10v2a7 7 0 0 1-14 0v-2M12 19v4M8 23h8" />
  </svg>
)

export const Info = (p) => (
  <svg {...base} {...p}>
    <circle cx="12" cy="12" r="10" />
    <path d="M12 16v-4M12 8h.01" />
  </svg>
)

export const Plus = (p) => (
  <svg {...base} {...p}>
    <path d="M12 5v14M5 12h14" />
  </svg>
)

export const Close = (p) => (
  <svg {...base} {...p}>
    <path d="M18 6 6 18M6 6l12 12" />
  </svg>
)

export const Alert = (p) => (
  <svg {...base} {...p}>
    <circle cx="12" cy="12" r="10" />
    <path d="M12 8v4M12 16h.01" />
  </svg>
)

// iOS status-bar glyphs
export const Signal = () => (
  <svg width="19" height="12" viewBox="0 0 19 12" aria-hidden="true">
    <rect x="0" y="7.5" width="3.2" height="4.5" rx="1" fill="#000" />
    <rect x="5" y="5" width="3.2" height="7" rx="1" fill="#000" />
    <rect x="10" y="2.5" width="3.2" height="9.5" rx="1" fill="#000" />
    <rect x="15" y="0" width="3.2" height="12" rx="1" fill="#000" />
  </svg>
)

export const Wifi = () => (
  <svg width="17" height="12" viewBox="0 0 17 12" aria-hidden="true">
    <path
      d="M8.5 2.6c2.3 0 4.4.9 6 2.4l1.2-1.2A10.2 10.2 0 0 0 8.5.9 10.2 10.2 0 0 0 1.3 3.8L2.5 5a8.5 8.5 0 0 1 6-2.4Zm0 3.4c1.4 0 2.6.5 3.6 1.4l1.2-1.2a6.8 6.8 0 0 0-9.6 0l1.2 1.2c1-.9 2.2-1.4 3.6-1.4Zm0 3.4c-.5 0-1 .2-1.3.5L8.5 11.2l1.3-1.3c-.3-.3-.8-.5-1.3-.5Z"
      fill="#000"
    />
  </svg>
)

export const Battery = () => (
  <svg width="27" height="13" viewBox="0 0 27 13" aria-hidden="true">
    <rect x=".5" y=".5" width="23" height="12" rx="3.8" fill="none" stroke="#000" opacity=".35" />
    <rect x="2" y="2" width="20" height="9" rx="2.5" fill="#000" />
    <path d="M25 4.5v4c.8-.3 1.3-1.1 1.3-2s-.5-1.7-1.3-2Z" fill="#000" opacity=".4" />
  </svg>
)

export const StarCircle = (p) => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true" {...p}>
    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.8" />
    <path
      d="m12 6.8 1.55 3.2 3.5.48-2.55 2.45.62 3.47L12 14.73 8.88 16.4l.62-3.47-2.55-2.45 3.5-.48L12 6.8Z"
      fill="currentColor"
    />
  </svg>
)
