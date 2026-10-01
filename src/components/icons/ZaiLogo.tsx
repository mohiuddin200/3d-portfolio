// Simple "Z" mark for Z.AI — react-icons has no Z.AI logo.
export function ZaiLogo({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <rect x="1.5" y="1.5" width="21" height="21" rx="5" stroke="currentColor" strokeWidth="2" />
      <path
        d="M7.5 7.5h9l-9 9h9"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
