'use client';

interface ResultsProps {
  wpm: number;
  rawWpm: number;
  accuracy: number;
  correctChars: number;
  incorrectChars: number;
  totalChars: number;
  timeUsed: number;
  onRestart: () => void;
}

export default function Results({
  wpm,
  rawWpm,
  accuracy,
  correctChars,
  incorrectChars,
  totalChars,
  timeUsed,
  onRestart,
}: ResultsProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-8 py-12">
      <div className="flex items-center gap-16">
        <div className="text-center">
          <div className="text-5xl font-bold text-[#e2b714]">{wpm}</div>
          <div className="text-[#646669] text-sm mt-1">wpm</div>
        </div>
        <div className="text-center">
          <div className="text-5xl font-bold text-[#d1d0c5]">{accuracy}%</div>
          <div className="text-[#646669] text-sm mt-1">accuracy</div>
        </div>
      </div>

      <div className="flex items-center gap-8 text-sm text-[#646669]">
        <div className="text-center">
          <div className="text-[#d1d0c5]">{rawWpm}</div>
          <div>raw wpm</div>
        </div>
        <div className="text-center">
          <div className="text-[#d1d0c5]">{correctChars}</div>
          <div>correct</div>
        </div>
        <div className="text-center">
          <div className="text-[#ca4754]">{incorrectChars}</div>
          <div>incorrect</div>
        </div>
        <div className="text-center">
          <div className="text-[#d1d0c5]">{totalChars}</div>
          <div>total</div>
        </div>
        <div className="text-center">
          <div className="text-[#d1d0c5]">{timeUsed}s</div>
          <div>time</div>
        </div>
      </div>

      <button
        onClick={onRestart}
        className="mt-4 px-6 py-2 bg-[#e2b714] text-[#1e1e1e] font-semibold rounded hover:bg-[#d1a812] transition-colors"
      >
        Next test
      </button>
    </div>
  );
}
