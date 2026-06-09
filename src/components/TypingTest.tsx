'use client';

import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { generateWords } from '@/data/words';
import { calculateWPM, calculateAccuracy } from '@/utils/typingUtils';
import Header from './Header';
import Results from './Results';

type TimerMode = 15 | 30 | 60 | 120;
type CharStatus = 'pending' | 'correct' | 'incorrect' | 'extra';

interface CharData {
  char: string;
  status: CharStatus;
  typed?: string; // Store what user actually typed if different from expected
}

const WORD_COUNT = 200;

export default function TypingTest() {
  const [timerMode, setTimerMode] = useState<TimerMode>(60);
  const [timeLeft, setTimeLeft] = useState<number>(timerMode);
  const [isActive, setIsActive] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [startTime, setStartTime] = useState<number | null>(null);

  const [words, setWords] = useState<string[]>(() => generateWords(WORD_COUNT));
  const [chars, setChars] = useState<CharData[]>(() =>
    words.join(' ').split('').map((c) => ({ char: c, status: 'pending' as CharStatus }))
  );
  const [currentPos, setCurrentPos] = useState(0);
  const [totalTyped, setTotalTyped] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [incorrectCount, setIncorrectCount] = useState(0);
  const [extraCount, setExtraCount] = useState(0);

  const [wpm, setWpm] = useState(0);
  const [rawWpm, setRawWpm] = useState(0);
  const [timeUsed, setTimeUsed] = useState(0);
  const [visibleStartLine, setVisibleStartLine] = useState(0);

  const hiddenInputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const charRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const isFinishedRef = useRef(false);
  const charsRef = useRef(chars);
  const currentPosRef = useRef(currentPos);
  const correctCountRef = useRef(correctCount);
  const incorrectCountRef = useRef(incorrectCount);
  const totalTypedRef = useRef(totalTyped);
  const extraCountRef = useRef(extraCount);
  const startTimeRef = useRef<number | null>(startTime);

  charsRef.current = chars;
  currentPosRef.current = currentPos;
  correctCountRef.current = correctCount;
  incorrectCountRef.current = incorrectCount;
  totalTypedRef.current = totalTyped;
  extraCountRef.current = extraCount;
  startTimeRef.current = startTime;

  const resetTest = useCallback(() => {
    setIsActive(false);
    setIsFinished(false);
    isFinishedRef.current = false;
    setStartTime(null);
    startTimeRef.current = null;
    setTimeLeft(timerMode);

    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    const newWords = generateWords(WORD_COUNT);
    setWords(newWords);
    const newChars = newWords.join(' ').split('').map((c) => ({ char: c, status: 'pending' as CharStatus }));
    setChars(newChars);
    charsRef.current = newChars;
    setCurrentPos(0);
    currentPosRef.current = 0;
    setTotalTyped(0);
    totalTypedRef.current = 0;
    setCorrectCount(0);
    correctCountRef.current = 0;
    setIncorrectCount(0);
    incorrectCountRef.current = 0;
    setExtraCount(0);
    extraCountRef.current = 0;
    setWpm(0);
    setRawWpm(0);
    setTimeUsed(0);
    setVisibleStartLine(0);

    setTimeout(() => {
      hiddenInputRef.current?.focus();
    }, 0);
  }, [timerMode]);

  useEffect(() => {
    resetTest();
  }, [timerMode, resetTest]);

  useEffect(() => {
    setTimeLeft(timerMode);
  }, [timerMode]);

  useEffect(() => {
    if (!isActive || isFinished || timeLeft <= 0) return;

    if (timeLeft <= 0 && isActive) {
      finishTest();
      return;
    }

    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          if (timerRef.current) clearInterval(timerRef.current);
          finishTest();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isActive, isFinished]);

   const finishTest = useCallback(() => {
     if (isFinishedRef.current) return;
     isFinishedRef.current = true;
     setIsFinished(true);
     setIsActive(false);

     if (timerRef.current) {
       clearInterval(timerRef.current);
       timerRef.current = null;
     }

     const elapsed = startTimeRef.current
       ? (Date.now() - startTimeRef.current) / 1000
       : timerMode;
     const used = Math.min(elapsed, timerMode);
     setTimeUsed(Math.round(used));

     const raw = calculateWPM(totalTypedRef.current, used);
     setRawWpm(raw);

     const effectiveChars = totalTypedRef.current - extraCountRef.current;
     const w = calculateWPM(effectiveChars, used);
     setWpm(w);
   }, [timerMode]);

  const processChar = useCallback((typedChar: string) => {
    if (isFinishedRef.current) return;

    if (!startTimeRef.current) {
      const now = Date.now();
      setStartTime(now);
      startTimeRef.current = now;
      setIsActive(true);
    }

    const currentChars = charsRef.current;
    const pos = currentPosRef.current;

    if (typedChar === 'Backspace') {
      if (pos > 0) {
        const prevPos = pos - 1;
        const prevChar = currentChars[prevPos];

        if (prevChar.status === 'extra') {
          const newTotal = totalTypedRef.current - 1;
          totalTypedRef.current = newTotal;
          setTotalTyped(newTotal);
          const newExtra = extraCountRef.current - 1;
          extraCountRef.current = newExtra;
          setExtraCount(newExtra);
          setCurrentPos(prevPos);
          currentPosRef.current = prevPos;
          return;
        }

        if (prevChar.status === 'correct') {
          correctCountRef.current -= 1;
          setCorrectCount(correctCountRef.current);
        } else if (prevChar.status === 'incorrect') {
          incorrectCountRef.current -= 1;
          setIncorrectCount(incorrectCountRef.current);
        }

        currentChars[prevPos] = { ...prevChar, status: 'pending' };
        charsRef.current = [...currentChars];
        setChars(charsRef.current);
        setCurrentPos(prevPos);
        currentPosRef.current = prevPos;

        const newTotal = totalTypedRef.current - 1;
        totalTypedRef.current = newTotal;
        setTotalTyped(newTotal);
      }
      return;
    }

    if (pos >= currentChars.length) {
      if (typedChar.length === 1) {
        currentChars.push({ char: typedChar, status: 'extra' });
        charsRef.current = [...currentChars];
        setChars(charsRef.current);
        setCurrentPos(pos + 1);
        currentPosRef.current = pos + 1;
        const newTotal = totalTypedRef.current + 1;
        totalTypedRef.current = newTotal;
        setTotalTyped(newTotal);
        const newExtra = extraCountRef.current + 1;
        extraCountRef.current = newExtra;
        setExtraCount(newExtra);
      }
      return;
    }

    const expectedChar = currentChars[pos].char;
    const isSpaceExpected = expectedChar === ' ';
    const isSpaceTyped = typedChar === ' ';

    if (isSpaceExpected && isSpaceTyped) {
      // Space typed when space expected = correct
      currentChars[pos] = { char: ' ', status: 'correct' };
      correctCountRef.current += 1;
      setCorrectCount(correctCountRef.current);
    } else if (isSpaceExpected && !isSpaceTyped) {
      // Any letter typed when space expected = incorrect, show what was typed
      currentChars[pos] = { char: ' ', status: 'incorrect', typed: typedChar };
      incorrectCountRef.current += 1;
      setIncorrectCount(incorrectCountRef.current);
    } else if (typedChar === expectedChar) {
      // Letter matches expected letter = correct
      currentChars[pos] = { char: expectedChar, status: 'correct' };
      correctCountRef.current += 1;
      setCorrectCount(correctCountRef.current);
    } else {
      // Letter doesn't match or space typed when letter expected = incorrect
      currentChars[pos] = { char: expectedChar, status: 'incorrect', typed: typedChar };
      incorrectCountRef.current += 1;
      setIncorrectCount(incorrectCountRef.current);
    }

    charsRef.current = [...currentChars];
    setChars(charsRef.current);
    setCurrentPos(pos + 1);
    currentPosRef.current = pos + 1;
    const newTotal = totalTypedRef.current + 1;
    totalTypedRef.current = newTotal;
    setTotalTyped(newTotal);
  }, []);

  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    if (isFinishedRef.current) return;

    if (e.key === 'Tab') {
      e.preventDefault();
      resetTest();
      return;
    }

    if (e.key === 'Backspace') {
      e.preventDefault();
      processChar('Backspace');
      return;
    }

    if (e.key.length === 1) {
      e.preventDefault();
      processChar(e.key);
    } else if (e.key === ' ') {
      e.preventDefault();
      processChar(' ');
    }
  }, [processChar, resetTest]);

  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Tab' && (isFinishedRef.current || !hiddenInputRef.current?.contains(e.target as Node))) {
        e.preventDefault();
        resetTest();
        hiddenInputRef.current?.focus();
        return;
      }

      if (isFinishedRef.current) return;

      if (!hiddenInputRef.current?.contains(e.target as Node) && e.key.length === 1) {
        hiddenInputRef.current?.focus();
      }
    };

    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => window.removeEventListener('keydown', handleGlobalKeyDown);
  }, [resetTest]);

  useEffect(() => {
    charRefs.current[currentPos]?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }, [currentPos]);

  const wordsPerLine = 10;
  const windowLines = 3;

  const lines = useMemo(() => {
    const arr: string[] = [];
    for (let i = 0; i < words.length; i += wordsPerLine) {
      arr.push(words.slice(i, i + wordsPerLine).join(' '));
    }
    return arr;
  }, [words]);

  const charStartIndices = useMemo(() => {
    const indices: number[] = [];
    let cur = 0;
    for (let i = 0; i < lines.length; i++) {
      indices.push(cur);
      cur += lines[i].length + 1; // +1 accounts for the space between line groups in the original text
    }
    return indices;
  }, [lines]);

  const visibleStartIndex = charStartIndices[visibleStartLine] ?? 0;
  const visibleEndIndex = charStartIndices[visibleStartLine + windowLines] ?? chars.length;

  useEffect(() => {
    if (currentPos >= visibleEndIndex && visibleStartLine + windowLines < lines.length) {
      setVisibleStartLine((s) => Math.min(s + windowLines, Math.max(0, lines.length - windowLines)));
    }
  }, [currentPos, visibleEndIndex, visibleStartLine, lines.length]);

  useEffect(() => {
    if (currentPos < visibleStartIndex && visibleStartLine > 0) {
      setVisibleStartLine((s) => Math.max(0, s - windowLines));
    }
  }, [currentPos, visibleStartIndex, visibleStartLine]);

  return (
    <div className="flex flex-col min-h-screen bg-[#1e1e1e]" suppressHydrationWarning>
      <Header
        timerMode={timerMode}
        onTimerModeChange={(mode) => setTimerMode(mode)}
        onRestart={resetTest}
      />

      <main className="flex-1 flex flex-col items-center justify-center w-full">
        {!isFinished && (
          <div className="w-full px-6 mb-12 max-w-2xl mx-auto">
            <div className="flex items-center justify-between mb-4">
              <div className="text-5xl font-mono font-bold text-[#e2b714]">{timeLeft}</div>
              <div className="text-sm text-[#646669] font-mono">
                {wpm > 0 && `${wpm} wpm`}
              </div>
            </div>

            <div className="w-full bg-[#2c2e31] h-1 rounded-full overflow-hidden">
              <div
                className="bg-[#e2b714] h-full transition-all duration-1000 ease-linear"
                style={{ width: `${((timerMode - timeLeft) / timerMode) * 100}%` }}
              />
            </div>
          </div>
        )}

        {!isFinished ? (
          <div
            ref={containerRef}
            className="w-full flex-1 flex items-center justify-center cursor-text select-none px-6"
            onClick={() => hiddenInputRef.current?.focus()}
          >
            <div className="w-full max-w-4xl">
              <div className="font-mono text-2xl leading-relaxed" style={{ whiteSpace: 'pre' }}>
                {Array.from({ length: windowLines }).map((_, idx) => {
                  const lineIndex = visibleStartLine + idx;
                  const lineStartChar = charStartIndices[lineIndex] ?? 0;
                  const lineEndChar = charStartIndices[lineIndex + 1] ?? chars.length;
                  
                  return (
                    <div key={idx} className="text-center min-h-[3rem] flex items-center justify-center">
                      {chars.slice(lineStartChar, lineEndChar).map((charData, charIdx) => {
                        const absCharIdx = lineStartChar + charIdx;
                        const getCharColor = (status: CharStatus) => {
                          switch (status) {
                            case 'correct':
                              return 'text-[#3dd68c]';
                            case 'incorrect':
                              return 'text-[#ca4754]';
                            case 'extra':
                              return 'text-[#ca4754] bg-[#4a2a2a]';
                            case 'pending':
                              return absCharIdx === currentPos
                                ? 'text-[#d1d0c5] bg-[#e2b714] animate-pulse'
                                : 'text-[#646669]';
                            default:
                              return 'text-[#646669]';
                          }
                        };
                        
                        return (
                          <span
                            key={charIdx}
                            ref={(el) => {
                              charRefs.current[absCharIdx] = el;
                            }}
                            className={`${getCharColor(charData.status)} transition-colors duration-75`}
                            style={{ whiteSpace: 'pre' }}
                          >
                            {charData.typed !== undefined ? charData.typed : charData.char}
                          </span>
                        );
                      })}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        ) : (
          <Results
            wpm={wpm}
            rawWpm={rawWpm}
            accuracy={calculateAccuracy(correctCount, incorrectCount)}
            correctChars={correctCount}
            incorrectChars={incorrectCount}
            extraChars={extraCount}
            missedChars={Math.max(0, chars.length - currentPos)}
            totalChars={totalTyped}
            timeUsed={timeUsed}
            onRestart={resetTest}
          />
        )}

        <input
          ref={hiddenInputRef}
          type="text"
          className="opacity-0 absolute -left-[9999px] w-0 h-0"
          onKeyDown={handleKeyDown}
          autoFocus
          aria-hidden="true"
        />
      </main>
    </div>
  );

}
