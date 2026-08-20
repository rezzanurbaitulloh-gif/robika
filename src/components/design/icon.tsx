import type { SVGProps } from "react";

export type IconName =
  | "home"
  | "gamepad"
  | "book"
  | "bolt"
  | "trophy"
  | "cart"
  | "user"
  | "logout"
  | "arrowLeft"
  | "arrowRight"
  | "sparkles"
  | "medal"
  | "flame"
  | "star"
  | "gem"
  | "check"
  | "x"
  | "upload"
  | "chat"
  | "code"
  | "play"
  | "certificate"
  | "chevronRight"
  | "shield"
  | "brain"
  | "palette"
  | "phone"
  | "puzzle"
  | "server"
  | "database"
  | "pen"
  | "settings"
  | "menu"
  | "clock"
  | "target"
  | "alert"
  | "info"
  | "lock"
  | "robot"
  | "skull"
  | "camera"
  | "layers"
  | "rocket"
  | "globe"
  | "mail"
  | "eye"
  | "eyeOff"
  | "refresh"
  | "moon"
  | "calendar";

const PATHS: Record<IconName, React.ReactNode> = {
  home: <path d="M3 10.5 12 3l9 7.5M5 9.5V21h14V9.5M9 21v-6h6v6" />,
  gamepad: (
    <>
      <rect x="2" y="6" width="20" height="12" rx="4" />
      <path d="M8 11v4M6 13h4" />
      <circle cx="16" cy="11" r="1" />
      <circle cx="18" cy="13" r="1" />
    </>
  ),
  book: <path d="M4 4h12a2 2 0 0 1 2 2v14H6a2 2 0 0 1-2-2V4Zm12 2h4v14a2 2 0 0 1-2 2M8 8h6M8 12h6" />,
  bolt: <path d="M13 2 3 14h7l-1 8 10-12h-7l1-8Z" />,
  trophy: <path d="M8 21h8M12 17v4M7 4h10v6a5 5 0 0 1-10 0V4ZM6 4H3v2a4 4 0 0 0 4 4M18 4h3v2a4 4 0 0 1-4 4" />,
  cart: (
    <>
      <circle cx="9" cy="20" r="1.5" />
      <circle cx="17" cy="20" r="1.5" />
      <path d="M3 4h2l2.5 11h9.5l2-7H6" />
    </>
  ),
  user: (
    <>
      <circle cx="12" cy="8" r="4" />
      <path d="M4 21c0-4 3.5-6 8-6s8 2 8 6" />
    </>
  ),
  logout: (
    <>
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <path d="M16 17l5-5-5-5M21 12H9" />
    </>
  ),
  arrowLeft: <path d="M19 12H5m6 6-6-6 6-6" />,
  arrowRight: <path d="M5 12h14m-6-6 6 6-6 6" />,
  sparkles: (
    <path d="M12 3l1.9 4.6L18.5 9.5l-4.6 1.9L12 16l-1.9-4.6L5.5 9.5l4.6-1.9L12 3ZM19 15l.9 2.1L22 18l-2.1.9L19 21l-.9-2.1L16 18l2.1-.9L19 15Z" />
  ),
  medal: (
    <>
      <circle cx="12" cy="14" r="5" />
      <path d="M9 9.5 7 3h4l1 3 1-3h4l-2 6.5M12 12l1 1 2-.5" />
    </>
  ),
  flame: <path d="M12 22c4 0 7-2.5 7-7 0-3-2-5-3-7-1 1-2 2-2 3 0-4-2-7-4-9-1 2-2 5-2 7 0 2 0 4-2 5-1 1-2 1-2 1 0 4 3 7 8 7Z" />,
  star: <path d="m12 2 2.9 6 6.6.8-4.8 4.6 1.2 6.5L12 17.9 6.1 19.9l1.2-6.5L2.5 8.8 9.1 8l2.9-6Z" />,
  gem: <path d="M6 3h12l4 6-10 12L2 9l4-6ZM2 9h20M9 3 7 9l5 12 5-12-2-6" />,
  check: <path d="m4 12 5 5L20 6" />,
  x: <path d="M6 6l12 12M18 6 6 18" />,
  upload: <path d="M12 16V4m-5 5 5-5 5 5M4 16v4h16v-4" />,
  chat: <path d="M4 5h16a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H8l-5 4v-6a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2ZM8 10h8M8 13h5" />,
  code: <path d="m8 7-5 5 5 5M16 7l5 5-5 5" />,
  play: <path d="M6 4v16l14-8L6 4Z" />,
  certificate: <path d="M7 3h10v5l-2 1 2 1v5H7v-5l2-1-2-1V3ZM6 3a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2M9 16v2M12 16v3M15 16v2M4 21h16" />,
  chevronRight: <path d="m9 6 6 6-6 6" />,
  shield: <path d="M12 3 5 6v6c0 4 3 7 7 9 4-2 7-5 7-9V6l-7-3Z" />,
  brain: (
    <>
      <path d="M9 4a3 3 0 0 0-3 3 3 3 0 0 0-1 5 3 3 0 0 0 1 5 3 3 0 0 0 3 3h6a3 3 0 0 0 3-3 3 3 0 0 0 1-5 3 3 0 0 0-1-5 3 3 0 0 0-3-3H9Z" />
      <path d="M12 3v18M9 8v8M15 8v8" />
    </>
  ),
  palette: (
    <>
      <path d="M12 3a9 9 0 0 0 0 18h1.5a1.5 1.5 0 0 0 0-3H12a1.5 1.5 0 0 1 0-3h5a5 5 0 0 0 5-5 9 9 0 0 0-10-7Z" />
      <circle cx="8" cy="9" r="1" />
      <circle cx="12" cy="7.5" r="1" />
      <circle cx="16" cy="9" r="1" />
    </>
  ),
  phone: <rect x="7" y="2" width="10" height="20" rx="3" />,
  puzzle: <path d="M10 3h5v3a2 2 0 0 0 4 0V3h3v5h-3a2 2 0 0 0 0 4h3v5h-3v-3a2 2 0 0 0-4 0v3h-5v-3a2 2 0 0 0-4 0v3H4v-5h3a2 2 0 0 0 0-4H4V7h3a2 2 0 0 0 4 0V3Z" />,
  server: (
    <>
      <rect x="3" y="4" width="18" height="7" rx="2" />
      <rect x="3" y="13" width="18" height="7" rx="2" />
      <path d="M7 7.5h.01M7 16.5h.01M11 7.5h6M11 16.5h6" />
    </>
  ),
  database: (
    <>
      <ellipse cx="12" cy="5" rx="8" ry="3" />
      <path d="M4 5v14c0 1.7 3.6 3 8 3s8-1.3 8-3V5M4 12c0 1.7 3.6 3 8 3s8-1.3 8-3" />
    </>
  ),
  pen: <path d="M17 3a2.8 2.8 0 0 1 4 4L8 20l-5 1 1-5L17 3Z" />,
  settings: (
    <>
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.9-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1-1.5 1.7 1.7 0 0 0-1.9.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.9 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1 1.7 1.7 0 0 0-.3-1.9l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.9.3h.1a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5h.1a1.7 1.7 0 0 0 1.9-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.9v.1a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1Z" />
    </>
  ),
  menu: <path d="M4 6h16M4 12h16M4 18h16" />,
  clock: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </>
  ),
  target: (
    <>
      <circle cx="12" cy="12" r="9" />
      <circle cx="12" cy="12" r="5" />
      <circle cx="12" cy="12" r="1" />
    </>
  ),
  alert: (
    <>
      <path d="M12 3 2 20h20L12 3Z" />
      <path d="M12 10v4M12 17h.01" />
    </>
  ),
  info: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 11v6M12 7.5h.01" />
    </>
  ),
  lock: (
    <>
      <rect x="4" y="11" width="16" height="10" rx="2" />
      <path d="M8 11V7a4 4 0 0 1 8 0v4" />
    </>
  ),
  robot: (
    <>
      <rect x="4" y="8" width="16" height="12" rx="3" />
      <rect x="9" y="11" width="6" height="4" rx="1" />
      <circle cx="9" cy="17" r="1" />
      <circle cx="15" cy="17" r="1" />
      <path d="M12 8V5m-3-1h6M2 13h2M20 13h2" />
    </>
  ),
  skull: (
    <>
      <circle cx="12" cy="11" r="7" />
      <path d="M9 17v3a1 1 0 0 0 1 1h4a1 1 0 0 0 1-1v-3M9 10h.01M15 10h.01M10 13h4" />
    </>
  ),
  camera: <path d="M4 7h3l2-3h6l2 3h3a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2Z" />,
  layers: <path d="m12 2 9 5-9 5-9-5 9-5ZM3 12l9 5 9-5M3 17l9 5 9-5" />,
  rocket: <path d="M12 2c3 1 5 3.5 5 8 0 3-1 6-3 9h-4c-2-3-3-6-3-9 0-4.5 2-7 5-8ZM8 15 4 21c2 0 4 0 5-2M16 15l4 6c-2 0-4 0-5-2M12 7h.01" />,
  globe: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18M12 3a15 15 0 0 1 0 18 15 15 0 0 1 0-18Z" />
    </>
  ),
  mail: (
    <>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="m3 7 9 6 9-6" />
    </>
  ),
  eye: <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />,
  eyeOff: <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68M6.61 6.61A13.53 13.53 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61M2 2l20 20" />,
  refresh: <path d="M20 12a8 8 0 1 1-2.34-5.66L20 8M20 3v5h-5" />,
  moon: <path d="M20 14.5A8.5 8.5 0 1 1 9.5 4a7 7 0 0 0 10.5 10.5Z" />,
  calendar: (
    <>
      <rect x="3" y="5" width="18" height="16" rx="2" />
      <path d="M8 3v4M16 3v4M3 9h18" />
    </>
  ),
};

interface IconProps extends SVGProps<SVGSVGElement> {
  name: IconName;
  size?: number;
}

export function Icon({ name, size = 16, ...rest }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      {...rest}
    >
      {PATHS[name]}
    </svg>
  );
}

export { PATHS as ICON_PATHS };