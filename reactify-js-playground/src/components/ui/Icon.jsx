const paths = {
  js: <path d="M4 3h16v18H4zM9.5 9v5.4c0 .9-.4 1.3-1.1 1.3-.6 0-1-.4-1.3-1M13 15.3c.4.7 1 1.2 2 1.2 1.1 0 1.8-.6 1.8-1.4 0-1-.7-1.3-1.8-1.8l-.6-.3c-1-.4-1.6-1-1.6-2 0-1 .8-1.8 2-1.8.9 0 1.5.3 1.9 1.1" />,
  react: (
    <>
      <ellipse cx="12" cy="12" rx="9.5" ry="3.8" />
      <ellipse cx="12" cy="12" rx="9.5" ry="3.8" transform="rotate(60 12 12)" />
      <ellipse cx="12" cy="12" rx="9.5" ry="3.8" transform="rotate(120 12 12)" />
      <circle cx="12" cy="12" r="1.6" fill="currentColor" stroke="none" />
    </>
  ),
  home: <path d="M3 10.5 12 3l9 7.5M5.5 9.5V20h13V9.5M10 20v-6h4v6" />,
  book: <path d="M4 4h6a3 3 0 0 1 3 3v13a2.5 2.5 0 0 0-2.5-2.5H4zM20 4h-6a3 3 0 0 0-3 3v13a2.5 2.5 0 0 1 2.5-2.5H20z" />,
  code: <path d="m8 7-5 5 5 5M16 7l5 5-5 5M13.5 4l-3 16" />,
  chart: <path d="M4 20V10M10 20V4M16 20v-7M22 20H2" />,
  info: <><circle cx="12" cy="12" r="9" /><path d="M12 11v5M12 7.6v.1" /></>,
  play: <path d="M7 4.5 19 12 7 19.5z" />,
  check: <path d="m4 12.5 5 5L20 6.5" />,
  cross: <path d="M6 6l12 12M18 6 6 18" />,
  reset: <path d="M4 4v6h6M4.5 13a7.5 7.5 0 1 0 2-6.4L4 10" />,
  bulb: <path d="M9 18h6M10 21h4M12 3a6 6 0 0 1 3.6 10.8c-.6.5-1.1 1.2-1.1 2.2h-5c0-1-.5-1.7-1.1-2.2A6 6 0 0 1 12 3z" />,
  eye: <><path d="M2 12s3.6-6.5 10-6.5S22 12 22 12s-3.6 6.5-10 6.5S2 12 2 12z" /><circle cx="12" cy="12" r="2.6" /></>,
  sun: <><circle cx="12" cy="12" r="4" /><path d="M12 2v2.5M12 19.5V22M2 12h2.5M19.5 12H22M4.9 4.9l1.8 1.8M17.3 17.3l1.8 1.8M19.1 4.9l-1.8 1.8M6.7 17.3l-1.8 1.8" /></>,
  moon: <path d="M20 14.5A8.5 8.5 0 0 1 9.5 4a8.5 8.5 0 1 0 10.5 10.5z" />,
  menu: <path d="M4 7h16M4 12h16M4 17h16" />,
  arrowLeft: <path d="M19 12H5M11 6l-6 6 6 6" />,
  arrowRight: <path d="M5 12h14M13 6l6 6-6 6" />,
  spark: <path d="M12 3l2.1 5.6L20 10.5l-5.9 1.9L12 18l-2.1-5.6L4 10.5l5.9-1.9z" />,
  compass: <><circle cx="12" cy="12" r="9" /><path d="m15.5 8.5-2 5-5 2 2-5z" /></>,
  flag: <path d="M6 21V4h11l-2 3.5L17 11H6" />,
  fire: <path d="M12 3s5 4 5 9a5 5 0 0 1-10 0c0-1.6.8-3 1.6-3.9.2 1.4 1 2.2 1.9 2.2 1.3 0 1.5-1.4 1.5-3 0-1.6-.5-3-.5-4.3z" />,
  calendar: <><rect x="3.5" y="5" width="17" height="16" rx="2" /><path d="M3.5 10h17M8 3v4M16 3v4" /></>,
  trophy: <path d="M8 4h8v5a4 4 0 0 1-8 0zM8 5.5H5V7a3 3 0 0 0 3 3M16 5.5h3V7a3 3 0 0 1-3 3M10 20h4M12 13v7" />,
  lock: <><rect x="4.5" y="10.5" width="15" height="10" rx="2" /><path d="M8 10.5V8a4 4 0 0 1 8 0v2.5" /></>,
};

export function Icon({ name, size = 20, className, ...rest }) {
  const shape = paths[name];
  if (!shape) return null;

  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      {...rest}
    >
      {shape}
    </svg>
  );
}

export default Icon;
