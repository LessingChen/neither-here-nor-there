export function Arrow() {
  return (
    <svg className="mark mark-arrow" viewBox="0 0 36 16" aria-hidden="true">
      <path d="M0.75 12.5 H28.5" />
      <path d="M23 8.75 L30 12.5 L23 16.25" />
    </svg>
  );
}

export function Exchange() {
  return (
    <svg className="mark mark-exchange" viewBox="0 0 36 16" aria-hidden="true">
      <g className="mark-forth">
        <path d="M7 5.75 H30" />
        <path d="M24.5 2.5 L31 5.75 L24.5 9" />
      </g>
      <g className="mark-back">
        <path d="M5.5 12.5 H28.5" />
        <path d="M11.5 9.25 L5 12.5 L11.5 15.75" />
      </g>
    </svg>
  );
}

export function Plus() {
  return (
    <svg className="mark mark-plus" viewBox="0 0 16 16" aria-hidden="true">
      <path d="M8 2.75 V13.25" />
      <path d="M2.75 8 H13.25" />
    </svg>
  );
}
