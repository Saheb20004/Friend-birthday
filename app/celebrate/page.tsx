'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const CANDLES = 7;
type Stage = 'intro' | 'blowing' | 'cut' | 'cutting' | 'blown';

export default function Celebrate() {
  const router = useRouter();
  const [stage, setStage] = useState<Stage>('intro');
  const [blownCandles, setBlownCandles] = useState<number[]>([]);
  const [visible, setVisible] = useState(true);
  const [sliceProgress, setSliceProgress] = useState(0);
  const [confetti, setConfetti] = useState<{ id: number; x: number; color: string; delay: number; duration: number; size: number }[]>([]);

  function fadeToStage(next: Stage, delay = 400) {
    setVisible(false);
    setTimeout(() => { setStage(next); setVisible(true); }, delay);
  }

  useEffect(() => {
    if (stage === 'blown') {
      setConfetti(Array.from({ length: 100 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        color: ['#facc15', '#fbbf24', '#f59e0b', '#ffffff', '#fde68a', '#fb923c', '#f87171'][Math.floor(Math.random() * 7)],
        delay: Math.random() * 3,
        duration: 2.5 + Math.random() * 2.5,
        size: 6 + Math.random() * 8,
      })));
    }
  }, [stage]);

  function handleBlowCandle(idx: number) {
    if (stage !== 'blowing') return;
    const next = [...blownCandles, idx];
    setBlownCandles(next);
    if (next.length === CANDLES) setTimeout(() => fadeToStage('cut'), 700);
  }

  function handleBlowAll() {
    if (stage !== 'blowing') return;
    setBlownCandles(Array.from({ length: CANDLES }, (_, i) => i));
    setTimeout(() => fadeToStage('cut'), 700);
  }

  function handleCut() {
    setStage('cutting');
    setSliceProgress(0);
    // Animate slice progress 0 -> 100 over 1.8s
    const start = performance.now();
    const duration = 1800;
    function tick(now: number) {
      const p = Math.min((now - start) / duration, 1);
      setSliceProgress(p);
      if (p < 1) requestAnimationFrame(tick);
      else setTimeout(() => fadeToStage('blown', 300), 400);
    }
    requestAnimationFrame(tick);
  }

  const allBlown = Array.from({ length: CANDLES }, (_, i) => i);

  return (
    <main className="min-h-screen bg-gradient-to-b from-black via-yellow-950 to-black flex flex-col items-center justify-center px-4 overflow-hidden relative">

      {confetti.map((c) => (
        <div
          key={c.id}
          className="absolute top-0 rounded-sm"
          style={{
            left: `${c.x}%`,
            width: c.size,
            height: c.size * 1.4,
            backgroundColor: c.color,
            animation: `fall ${c.duration}s ${c.delay}s ease-in both`,
          }}
        />
      ))}

      <style>{`
        @keyframes fall {
          0%   { transform: translateY(-20px) rotate(0deg); opacity: 1; }
          100% { transform: translateY(100vh) rotate(720deg); opacity: 0; }
        }
        @keyframes flicker {
          0%,100% { transform: scaleY(1) scaleX(1) translateY(0); opacity:1; }
          20%     { transform: scaleY(1.3) scaleX(0.75) translateY(-2px); opacity:0.9; }
          40%     { transform: scaleY(0.85) scaleX(1.15) translateY(1px); opacity:1; }
          60%     { transform: scaleY(1.2) scaleX(0.8) translateY(-1px); opacity:0.95; }
          80%     { transform: scaleY(0.9) scaleX(1.1) translateY(0); opacity:1; }
        }
        @keyframes smoke {
          0%   { transform: translateY(0) scaleX(1); opacity: 0.7; }
          100% { transform: translateY(-32px) scaleX(3); opacity: 0; }
        }
        @keyframes pulse-glow {
          0%,100% { box-shadow: 0 0 20px #facc15; }
          50%     { box-shadow: 0 0 55px #facc15, 0 0 90px #f59e0b; }
        }
        @keyframes knife-down {
          0%   { transform: translate(60px, -120px) rotate(35deg); opacity: 0; }
          15%  { opacity: 1; }
          55%  { transform: translate(0px, 0px) rotate(35deg); opacity: 1; }
          80%  { transform: translate(0px, 0px) rotate(35deg); opacity: 1; }
          100% { transform: translate(-40px, 60px) rotate(35deg); opacity: 0; }
        }
        @keyframes cake-shake {
          0%,100% { transform: translateX(0); }
          20%     { transform: translateX(-3px); }
          40%     { transform: translateX(3px); }
          60%     { transform: translateX(-2px); }
          80%     { transform: translateX(2px); }
        }
        .knife-anim  { animation: knife-down 1.8s cubic-bezier(0.4,0,0.2,1) forwards; }
        .cake-shake  { animation: cake-shake 1.8s ease-in-out; }
        .pulse-glow  { animation: pulse-glow 2s ease-in-out infinite; }
        .fade-section { transition: opacity 0.35s ease, transform 0.35s ease; }
        .fade-section.hidden-section { opacity:0; transform:translateY(10px); pointer-events:none; }
        .fade-section.visible-section { opacity:1; transform:translateY(0); }
      `}</style>

      <button
        onClick={() => router.push('/')}
        className="absolute top-6 left-6 text-yellow-400 border border-yellow-500 px-4 py-2 rounded-full text-sm hover:bg-yellow-500 hover:text-black transition-all z-10"
      >
        ← Back
      </button>

      {/* Cake */}
      <div className={`relative inline-block mb-2 ${stage === 'cutting' ? 'cake-shake' : ''}`}>
        <CakeDisplay
          blown={stage === 'intro' ? [] : stage === 'blowing' ? blownCandles : allBlown}
          sliceProgress={stage === 'cutting' || stage === 'blown' ? sliceProgress : 0}
          onCandleClick={handleBlowCandle}
          interactive={stage === 'blowing'}
        />
        {stage === 'cutting' && (
          <div className="knife-anim absolute -top-8 left-1/2 -translate-x-1/2 text-5xl pointer-events-none z-20 drop-shadow-lg">
            🔪
          </div>
        )}
      </div>

      {/* Controls */}
      <div className={`fade-section text-center mt-6 ${visible ? 'visible-section' : 'hidden-section'}`}>
        {stage === 'intro' && (
          <>
            <p className="text-yellow-300 text-xl mb-6">It&apos;s time to celebrate! Blow out the candles 🕯️</p>
            <button onClick={() => fadeToStage('blowing')} className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-black px-10 py-4 rounded-full font-bold text-xl hover:scale-105 transition-transform pulse-glow">
              💨 Start Blowing!
            </button>
          </>
        )}
        {stage === 'blowing' && (
          <>
            <p className="text-yellow-300 text-xl mb-1">Click each candle to blow it out!</p>
            <p className="text-gray-400 text-sm mb-5">{blownCandles.length}/{CANDLES} blown</p>
            <button onClick={handleBlowAll} className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-black px-8 py-3 rounded-full font-bold text-lg hover:scale-105 transition-transform">
              💨 Blow All!
            </button>
          </>
        )}
        {stage === 'cut' && (
          <>
            <p className="text-yellow-300 text-xl mb-6">All candles out! Now cut the cake 🎂</p>
            <button onClick={handleCut} className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-black px-10 py-4 rounded-full font-bold text-xl hover:scale-105 transition-transform pulse-glow">
              🔪 Cut the Cake!
            </button>
          </>
        )}
        {stage === 'cutting' && (
          <p className="text-yellow-300 text-xl animate-pulse">Cutting the cake... 🎂</p>
        )}
        {stage === 'blown' && (
          <>
            <div className="text-5xl mb-3">🎉🎂🎉</div>
            <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-yellow-300 via-yellow-400 to-yellow-500 bg-clip-text text-transparent mb-3">
              Happy Birthday!
            </h1>
            <p className="text-yellow-300 text-xl mb-6">Make a wish! ✨</p>
            <button onClick={() => router.push('/')} className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-black px-10 py-4 rounded-full font-bold text-xl hover:scale-105 transition-transform pulse-glow">
              🎊 Back to Celebration
            </button>
          </>
        )}
      </div>
    </main>
  );
}

function CakeDisplay({
  blown, sliceProgress, onCandleClick, interactive,
}: {
  blown: number[];
  sliceProgress: number;
  onCandleClick?: (idx: number) => void;
  interactive: boolean;
}) {
  const candleXPositions = [118, 131, 144, 160, 176, 189, 202];
  const colors = ['#ef4444','#f97316','#eab308','#22c55e','#3b82f6','#8b5cf6','#ec4899'];
  const candleH = 28;
  const wickH = 6;
  const flameH = 14;

  return (
    <div className="flex flex-col items-center select-none" style={{ width: 320 }}>
      {/* Single SVG — candles + cake all in one coordinate space */}
      <svg viewBox="0 0 320 290" width="320" height="290" style={{ overflow: 'visible' }}>
        <defs>
          {/* Frosting texture */}
          <radialGradient id="topFrost" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#fffbeb" />
            <stop offset="100%" stopColor="#fde68a" />
          </radialGradient>
          <linearGradient id="tier1Side" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#fde68a" />
            <stop offset="40%" stopColor="#fbbf24" />
            <stop offset="100%" stopColor="#d97706" />
          </linearGradient>
          <linearGradient id="tier2Side" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#fbbf24" />
            <stop offset="40%" stopColor="#f59e0b" />
            <stop offset="100%" stopColor="#b45309" />
          </linearGradient>
          <linearGradient id="tier3Side" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#f59e0b" />
            <stop offset="40%" stopColor="#d97706" />
            <stop offset="100%" stopColor="#92400e" />
          </linearGradient>
          <linearGradient id="plateGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="100%" stopColor="#e5e7eb" />
          </linearGradient>
          {/* Slice clip path — grows from top to bottom */}
          <clipPath id="leftSlice">
            <polygon points={`160,${100 - sliceProgress * 40} 0,0 0,280 160,280`} />
          </clipPath>
          <clipPath id="rightSlice">
            <polygon points={`160,${100 - sliceProgress * 40} 320,0 320,280 160,280`} />
          </clipPath>
        </defs>

        {/* ── PLATE ── */}
        <ellipse cx="160" cy="272" rx="155" ry="12" fill="url(#plateGrad)" stroke="#d1d5db" strokeWidth="1" />
        <ellipse cx="160" cy="269" rx="155" ry="8" fill="white" opacity="0.5" />

        {/* ── BOTTOM TIER ── */}
        <rect x="30" y="210" width="260" height="58" rx="4" fill="url(#tier3Side)" />
        <rect x="30" y="225" width="260" height="6" fill="#92400e" opacity="0.5" />
        <rect x="30" y="237" width="260" height="5" fill="#fde68a" opacity="0.6" />
        <rect x="30" y="248" width="260" height="5" fill="#92400e" opacity="0.5" />
        {[50,80,110,140,170,200,230,260].map((x, i) => (
          <ellipse key={i} cx={x} cy="212" rx="7" ry="10" fill="#fffbeb" opacity="0.9" />
        ))}
        <ellipse cx="160" cy="212" rx="130" ry="10" fill="#fffbeb" />
        <ellipse cx="160" cy="211" rx="128" ry="8" fill="url(#topFrost)" />
        <text x="100" y="240" fontSize="13" fill="#92400e" fontWeight="bold" opacity="0.8">Happy Birthday</text>
        {[55,100,160,220,265].map((x, i) => (
          <circle key={i} cx={x} cy="227" r="4" fill={['#ef4444','#3b82f6','#22c55e','#8b5cf6','#f97316'][i]} />
        ))}

        {/* ── MIDDLE TIER ── */}
        <rect x="70" y="158" width="180" height="56" rx="4" fill="url(#tier2Side)" />
        <rect x="70" y="172" width="180" height="5" fill="#92400e" opacity="0.5" />
        <rect x="70" y="184" width="180" height="5" fill="#fde68a" opacity="0.6" />
        <rect x="70" y="196" width="180" height="5" fill="#92400e" opacity="0.5" />
        {[85,110,135,160,185,210,235].map((x, i) => (
          <ellipse key={i} cx={x} cy="160" rx="6" ry="8" fill="#fffbeb" opacity="0.9" />
        ))}
        <ellipse cx="160" cy="160" rx="90" ry="8" fill="#fffbeb" />
        <ellipse cx="160" cy="159" rx="88" ry="6" fill="url(#topFrost)" />
        {[90,130,160,190,230].map((x, i) => (
          <circle key={i} cx={x} cy="174" r="3" fill={['#f97316','#22c55e','#ef4444','#3b82f6','#eab308'][i]} />
        ))}

        {/* ── TOP TIER ── */}
        <rect x="110" y="114" width="100" height="46" rx="4" fill="url(#tier1Side)" />
        <rect x="110" y="126" width="100" height="4" fill="#92400e" opacity="0.5" />
        <rect x="110" y="136" width="100" height="4" fill="#fde68a" opacity="0.6" />
        <rect x="110" y="146" width="100" height="4" fill="#92400e" opacity="0.5" />
        {[118,135,152,168,185,202].map((x, i) => (
          <ellipse key={i} cx={x} cy="116" rx="5" ry="7" fill="#fffbeb" opacity="0.9" />
        ))}
        <ellipse cx="160" cy="116" rx="50" ry="6" fill="#fffbeb" />
        <ellipse cx="160" cy="115" rx="48" ry="5" fill="url(#topFrost)" />

        {/* ── CANDLES sitting on top tier (bottom of candle = y:114) ── */}
        {candleXPositions.map((cx, i) => {
          const isBlown = blown.includes(i);
          const cBottom = 114;              // candle base sits on top of cake
          const cTop    = cBottom - candleH; // top of candle body
          const wickTip = cTop - wickH;      // top of wick
          const flameBot = wickTip;
          const flameMid = flameBot - flameH * 0.55;
          const flameTop = flameBot - flameH;
          return (
            <g
              key={i}
              onClick={() => onCandleClick?.(i)}
              style={{ cursor: interactive && !isBlown ? 'pointer' : 'default' }}
            >
              {/* Candle body */}
              <rect
                x={cx - 4} y={cTop}
                width="8" height={candleH} rx="2"
                fill={colors[i]}
                style={{ filter: !isBlown ? `drop-shadow(0 0 5px ${colors[i]})` : 'none', transition: 'filter 0.5s' }}
              />
              {/* Highlight on candle */}
              <rect x={cx - 3} y={cTop + 2} width="2" height={candleH - 4} rx="1" fill="white" opacity="0.25" />
              {/* Wax drip on side */}
              <path d={`M${cx+2},${cTop+4} Q${cx+5},${cTop+10} ${cx+3},${cTop+16}`} stroke={colors[i]} strokeWidth="2" fill="none" opacity="0.6" />
              {/* Wick — small line at top center of candle */}
              <line x1={cx} y1={cTop} x2={cx} y2={wickTip} stroke="#1f2937" strokeWidth="1.5" strokeLinecap="round" />
              {/* Flame or smoke */}
              {!isBlown ? (
                <g style={{ transformOrigin: `${cx}px ${flameBot}px`, animation: 'flicker 0.45s ease-in-out infinite' }}>
                  {/* Glow */}
                  <ellipse cx={cx} cy={flameMid} rx="8" ry="10" fill={colors[i]} opacity="0.15" />
                  {/* Outer flame */}
                  <ellipse cx={cx} cy={flameMid} rx="4.5" ry={flameH * 0.52} fill="#fb923c" />
                  {/* Inner flame */}
                  <ellipse cx={cx} cy={flameMid + 2} rx="2.8" ry={flameH * 0.38} fill="#fde68a" />
                  {/* White core */}
                  <ellipse cx={cx} cy={flameMid + 3} rx="1.3" ry={flameH * 0.22} fill="white" opacity="0.95" />
                </g>
              ) : (
                /* Smoke wisps */
                <g style={{ animation: 'smoke 1.4s ease-out forwards' }}>
                  <ellipse cx={cx} cy={wickTip - 4} rx="1.5" ry="6" fill="#9ca3af" opacity="0.55" />
                  <ellipse cx={cx + 2} cy={wickTip - 10} rx="1" ry="4" fill="#9ca3af" opacity="0.3" />
                </g>
              )}
            </g>
          );
        })}

        {/* ── SLICE CUT LINE (animated) ── */}
        {sliceProgress > 0 && (
          <>
            <line
              x1="160" y1={116 - sliceProgress * 10}
              x2="160" y2={116 + sliceProgress * 156}
              stroke="#78350f" strokeWidth="2.5" strokeDasharray="4 2"
              opacity={Math.min(sliceProgress * 3, 1)}
            />
            <line
              x1="160" y1={116 - sliceProgress * 10}
              x2="160" y2={116 + sliceProgress * 156}
              stroke="#fde68a" strokeWidth="1"
              opacity={Math.min(sliceProgress * 2, 0.8)}
            />
            <g transform={`translate(${-sliceProgress * 6}, 0)`} clipPath="url(#leftSlice)">
              <rect x="30" y="210" width="260" height="58" rx="4" fill="url(#tier3Side)" />
              <rect x="70" y="158" width="180" height="56" rx="4" fill="url(#tier2Side)" />
              <rect x="110" y="114" width="100" height="46" rx="4" fill="url(#tier1Side)" />
            </g>
            <g transform={`translate(${sliceProgress * 6}, 0)`} clipPath="url(#rightSlice)">
              <rect x="30" y="210" width="260" height="58" rx="4" fill="url(#tier3Side)" />
              <rect x="70" y="158" width="180" height="56" rx="4" fill="url(#tier2Side)" />
              <rect x="110" y="114" width="100" height="46" rx="4" fill="url(#tier1Side)" />
            </g>
            {sliceProgress > 0.3 && (
              <>
                <rect x="157" y="116" width="6" height={sliceProgress * 150} fill="#fde68a" opacity="0.7" />
                <rect x="157" y="162" width="6" height={sliceProgress * 100} fill="#92400e" opacity="0.4" />
                <rect x="157" y="212" width="6" height={sliceProgress * 55} fill="#fde68a" opacity="0.6" />
              </>
            )}
          </>
        )}
      </svg>
    </div>
  );
}
