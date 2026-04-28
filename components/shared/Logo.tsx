export function LogoIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none">
      <circle cx="10" cy="10" r="7" stroke="white" strokeWidth="2"/>
      <circle cx="10" cy="10" r="3" fill="#00C896"/>
      <line x1="10" y1="1" x2="10" y2="4" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
      <line x1="10" y1="16" x2="10" y2="19" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
      <line x1="1" y1="10" x2="4" y2="10" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
      <line x1="16" y1="10" x2="19" y2="10" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  );
}

export function LogoIconDark({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none">
      <circle cx="10" cy="10" r="7" stroke="#0F2B5B" strokeWidth="2"/>
      <circle cx="10" cy="10" r="3" fill="#00C896"/>
      <line x1="10" y1="1" x2="10" y2="4" stroke="#0F2B5B" strokeWidth="1.5" strokeLinecap="round"/>
      <line x1="10" y1="16" x2="10" y2="19" stroke="#0F2B5B" strokeWidth="1.5" strokeLinecap="round"/>
      <line x1="1" y1="10" x2="4" y2="10" stroke="#0F2B5B" strokeWidth="1.5" strokeLinecap="round"/>
      <line x1="16" y1="10" x2="19" y2="10" stroke="#0F2B5B" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  );
}
