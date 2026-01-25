import { Locale } from '@/types';

interface LogoProps {
  locale: Locale;
  className?: string;
}

export default function Logo({ locale, className = '' }: LogoProps) {
  return (
    <div className={`flex flex-col items-center ${className}`}>
      <svg
        width="80"
        height="70"
        viewBox="0 0 80 70"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="roofGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#7c3aed" />
            <stop offset="100%" stopColor="#3b82f6" />
          </linearGradient>
          <linearGradient id="curveGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#7c3aed" />
            <stop offset="100%" stopColor="#3b82f6" />
          </linearGradient>
        </defs>
        
        {/* House Icon */}
        {/* Right side of house - light blue continuous shape */}
        <path
          d="M40 8 L60 22 L60 40 L40 40 L40 8 Z"
          fill="#93c5fd"
          stroke="#3b82f6"
          strokeWidth="1.5"
        />
        
        {/* Left roof with 4 parallel diagonal gradient stripes */}
        <path d="M20 22 L40 8 L40 22 Z" fill="url(#roofGradient)" />
        {/* Four parallel diagonal stripes */}
        <line x1="24" y1="18" x2="24" y2="22" stroke="#fff" strokeWidth="1" opacity="0.5" />
        <line x1="28" y1="15" x2="28" y2="19" stroke="#fff" strokeWidth="1" opacity="0.5" />
        <line x1="32" y1="12" x2="32" y2="16" stroke="#fff" strokeWidth="1" opacity="0.5" />
        <line x1="36" y1="9" x2="36" y2="13" stroke="#fff" strokeWidth="1" opacity="0.5" />
        
        {/* Left wall outline */}
        <path
          d="M20 40 L20 22 L40 8"
          fill="none"
          stroke="#3b82f6"
          strokeWidth="2"
        />
        <line x1="20" y1="40" x2="60" y2="40" stroke="#3b82f6" strokeWidth="2" />
        
        {/* Square window with cross - orange-yellow */}
        <rect x="24" y="28" width="8" height="8" fill="#fbbf24" />
        <line x1="28" y1="28" x2="28" y2="36" stroke="#fff" strokeWidth="0.8" />
        <line x1="24" y1="32" x2="32" y2="32" stroke="#fff" strokeWidth="0.8" />
        
        {/* Text: Résidence in green cursive */}
        <text
          x="40"
          y="50"
          fontSize="9"
          fill="#166534"
          fontStyle="italic"
          fontFamily="serif"
          textAnchor="middle"
        >
          Résidence
        </text>
        
        {/* Text: AMIZADE in black bold sans-serif */}
        <text
          x="40"
          y="62"
          fontSize="11"
          fill="#000"
          fontWeight="bold"
          fontFamily="sans-serif"
          textAnchor="middle"
          letterSpacing="1.5"
        >
          AMIZADE
        </text>
        
        {/* Curved gradient line underneath */}
        <path
          d="M 5 55 Q 40 50 75 55"
          fill="none"
          stroke="url(#curveGradient)"
          strokeWidth="3"
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
}
