'use client';

export function DecorativeElements() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {/* Floppy Disk - Bottom Left */}
      <svg
        className="absolute bottom-8 left-4 sm:bottom-16 sm:left-6 w-24 h-24 sm:w-32 sm:h-32 transform -rotate-12"
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect x="10" y="15" width="80" height="70" fill="#f5e6d3" stroke="#000" strokeWidth="3" />
        <rect x="20" y="25" width="60" height="25" fill="#6b5344" stroke="#000" strokeWidth="2" />
        <rect x="15" y="60" width="70" height="8" fill="#d4a13d" stroke="#000" strokeWidth="2" />
        <text x="50" y="78" fontSize="12" fontWeight="bold" textAnchor="middle" fill="#000">
          3.5&quot;
        </text>
      </svg>

      {/* Old CRT Computer - Right Side */}
      <svg
        className="absolute top-20 right-4 sm:right-8 w-28 h-28 sm:w-40 sm:h-40 transform rotate-3"
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Monitor body */}
        <rect x="15" y="10" width="70" height="55" rx="5" fill="#6b5344" stroke="#000" strokeWidth="3" />
        {/* Screen */}
        <rect x="20" y="15" width="60" height="40" fill="#1e3a5f" stroke="#000" strokeWidth="2" />
        {/* 404 text on screen */}
        <text x="50" y="45" fontSize="16" fontWeight="bold" textAnchor="middle" fill="#d4a13d">
          404
        </text>
        {/* Stand */}
        <rect x="40" y="55" width="20" height="15" fill="#6b5344" stroke="#000" strokeWidth="2" />
        <rect x="35" y="70" width="30" height="5" fill="#6b5344" stroke="#000" strokeWidth="2" />
      </svg>

      {/* Roman Bust/Statue - Right Center */}
      <svg
        className="absolute top-1/2 right-2 sm:right-6 w-24 h-32 sm:w-36 sm:h-48 -translate-y-1/2 transform -rotate-6"
        viewBox="0 0 60 80"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Head */}
        <circle cx="30" cy="20" r="12" fill="#d4c4a8" stroke="#000" strokeWidth="2" />
        {/* Crown/Hair */}
        <path d="M 18 15 L 20 8 L 30 5 L 40 8 L 42 15" fill="#6b5344" stroke="#000" strokeWidth="2" />
        {/* Neck */}
        <rect x="26" y="32" width="8" height="8" fill="#d4c4a8" stroke="#000" strokeWidth="2" />
        {/* Shoulders/Torso */}
        <path d="M 15 40 L 20 65 L 40 65 L 45 40 Z" fill="#6b5344" stroke="#000" strokeWidth="2" />
        {/* Base */}
        <rect x="10" y="65" width="40" height="12" fill="#d4c4a8" stroke="#000" strokeWidth="2" />
      </svg>

      {/* Smiley Balloon - Top Center */}
      <svg
        className="absolute top-4 left-1/2 -translate-x-1/2 w-24 h-32 sm:w-32 sm:h-40 transform rotate-12"
        viewBox="0 0 100 120"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Balloon */}
        <circle cx="50" cy="35" r="30" fill="#d4a13d" stroke="#000" strokeWidth="3" />
        {/* Left Eye */}
        <circle cx="40" cy="28" r="4" fill="#000" />
        {/* Right Eye */}
        <circle cx="60" cy="28" r="4" fill="#000" />
        {/* Smile */}
        <path d="M 40 38 Q 50 45 60 38" stroke="#000" strokeWidth="2" fill="none" strokeLinecap="round" />
        {/* String */}
        <line x1="50" y1="65" x2="50" y2="95" stroke="#000" strokeWidth="2" />
      </svg>

      {/* Crescent Moon - Top Right Area */}
      <svg
        className="absolute top-24 right-1/4 w-20 h-20 sm:w-28 sm:h-28 transform -rotate-45"
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Moon */}
        <circle cx="50" cy="50" r="35" fill="#f5e6d3" stroke="#000" strokeWidth="3" />
        {/* Shadow/crater to make it crescent */}
        <circle cx="60" cy="50" r="32" fill="#1e3a5f" />
        {/* Left Eye */}
        <circle cx="35" cy="45" r="3" fill="#000" />
        {/* Smile */}
        <path d="M 32 52 Q 40 58 48 55" stroke="#000" strokeWidth="2" fill="none" strokeLinecap="round" />
      </svg>

      {/* Rotary Phone - Left Center */}
      <svg
        className="absolute top-1/2 left-2 sm:left-6 w-24 h-24 sm:w-32 sm:h-32 -translate-y-1/2 transform rotate-6"
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Base */}
        <rect x="20" y="50" width="60" height="25" rx="5" fill="#d4a13d" stroke="#000" strokeWidth="2" />
        {/* Dial */}
        <circle cx="50" cy="40" r="20" fill="#6b5344" stroke="#000" strokeWidth="3" />
        {/* Rotary holes */}
        {[0, 36, 72, 108, 144, 180, 216, 252, 288, 324].map((angle) => {
          const rad = (angle * Math.PI) / 180;
          const x = 50 + 14 * Math.cos(rad);
          const y = 40 + 14 * Math.sin(rad);
          return (
            <circle key={angle} cx={x} cy={y} r="2" fill="#000" />
          );
        })}
        {/* Receiver hooks */}
        <path d="M 25 50 Q 20 35 25 20" stroke="#000" strokeWidth="3" fill="none" strokeLinecap="round" />
        <path d="M 75 50 Q 80 35 75 20" stroke="#000" strokeWidth="3" fill="none" strokeLinecap="round" />
      </svg>

      {/* Decorative shapes - Zigzag pattern upper left */}
      <svg
        className="absolute top-8 left-8 w-16 h-16 sm:w-20 sm:h-20 transform -rotate-3"
        viewBox="0 0 60 60"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M 10 10 L 20 30 L 30 10 L 40 30 L 50 10"
          stroke="#1e3a5f"
          strokeWidth="3"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M 10 45 L 20 25 L 30 45 L 40 25 L 50 45"
          stroke="#d4a13d"
          strokeWidth="3"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>

      {/* Floating star burst - Bottom right area */}
      <svg
        className="absolute bottom-20 right-8 w-16 h-16 sm:w-20 sm:h-20 transform rotate-12"
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* 8-pointed star */}
        {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => {
          const rad = (angle * Math.PI) / 180;
          const x2 = 50 + 40 * Math.cos(rad);
          const y2 = 50 + 40 * Math.sin(rad);
          return (
            <line
              key={angle}
              x1="50"
              y1="50"
              x2={x2}
              y2={y2}
              stroke="#d4a13d"
              strokeWidth="3"
              strokeLinecap="round"
            />
          );
        })}
        <circle cx="50" cy="50" r="8" fill="#d4a13d" stroke="#000" strokeWidth="2" />
      </svg>
    </div>
  );
}
