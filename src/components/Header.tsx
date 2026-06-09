'use client';

type TimerMode = 15 | 30 | 60 | 120;

interface HeaderProps {
  timerMode: TimerMode;
  onTimerModeChange: (mode: TimerMode) => void;
  onRestart: () => void;
}

export default function Header({ timerMode, onTimerModeChange, onRestart }: HeaderProps) {
  const timerOptions: TimerMode[] = [15, 30, 60, 120];

  return (
    <header className="flex items-center justify-between px-4 py-3 border-b border-[#2c2e31]">
      <div className="flex items-center gap-2">
        <span className="text-[#e2b714] text-xl font-bold">keytype</span>
      </div>

      <div className="flex items-center gap-6">
        <div className="flex items-center gap-1">
          <span className="text-[#646669] text-xs me-1">time</span>
          {timerOptions.map((opt) => (
            <button
              key={opt}
              onClick={() => onTimerModeChange(opt)}
              className={`px-2 py-1 text-sm rounded transition-colors ${
                timerMode === opt
                  ? 'text-[#e2b714]'
                  : 'text-[#646669] hover:text-[#d1d0c5]'
              }`}
            >
              {opt}
            </button>
          ))}
        </div>

        <button
          onClick={onRestart}
          className="text-[#646669] hover:text-[#d1d0c5] transition-colors"
          title="Restart test (Tab)"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="1 4 1 10 7 10" />
            <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10" />
          </svg>
        </button>
      </div>
    </header>
  );
}
