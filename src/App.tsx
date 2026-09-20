import { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { motion } from 'motion/react';

const vibesData = [
  { imageUrl: '/images/vibe1.jpeg', message: 'Making high school geography look effortlessly cool. You always know exactly where you are in the world, even when the rest of us are lost.', vibe_tag: 'The Geography Teacher' },
  { imageUrl: '/images/vibe2.jpeg', message: 'Bringing the perfect harmony to the absolute chaos of everyday life. A true vocal powerhouse, both in the choir and out in the wild.', vibe_tag: 'The Vocalist' },
  { imageUrl: '/images/vibe3.jpeg', message: 'Undisputed champion of the snooze button and professional dream chaser. Let us be completely honest - your bed is your true soulmate.', vibe_tag: 'The Sleep Enthusiast' },
  { imageUrl: '/images/vibe4.jpeg', message: 'An absolute masterclass in always smelling fantastic. Catching a breeze past you is basically a free, top-tier aromatherapy session.', vibe_tag: 'The Signature Scent' },
  { imageUrl: '/images/vibe5.jpeg', message: 'Slowly but surely conquering Afrikaans, one highly questionable pronunciation at a time. Baie mooi progress, all things considered.', vibe_tag: 'The Afrikaans Scholar' },
  { imageUrl: '/images/vibe6.jpeg', message: 'A wildly unfair combination of brilliant and beautiful. You have got the kind of sharp intellect and effortless looks that keep everyone on their toes, and I think that is why they named you Ntswaki.', vibe_tag: 'Brains & Beauty' },
  { imageUrl: '/images/vibe7.jpeg', message: 'Deeply rooted in faith and walking with quiet, unshakeable grace. A constant reminder that the best kind of strength and light comes from above.', vibe_tag: 'Faith & Grace' },
  { imageUrl: '/images/vibe8.jpeg', message: 'A literal breath of fresh air that never fails to put a smile on my face. You bring a revitalizing, effortless energy to every room you walk into.', vibe_tag: 'The Vibe' },
];

function BalloonPopGame({ onComplete }: { onComplete: () => void }) {
  const [balloons, setBalloons] = useState<{ id: number, color: string, x: number, size: number, type: 'target' | 'distractor', duration: number, delay: number }[]>([]);
  const [poppedCount, setPoppedCount] = useState(0);
  const [isDone, setIsDone] = useState(false);

  useEffect(() => {
    // Generate initial set of balloons starting strictly above the viewport
    const initialBalloons = Array.from({ length: 65 }, (_, i) => ({
      id: i,
      color: Math.random() > 0.4 ? 'bg-gradient-to-b from-pink-400 to-pink-600 shadow-pink-300/50' : (Math.random() > 0.5 ? 'bg-gradient-to-b from-purple-400 to-purple-600 shadow-purple-300/50' : 'bg-gradient-to-b from-rose-300 to-rose-500 shadow-rose-200/50'),
      type: Math.random() > 0.25 ? ('target' as const) : ('distractor' as const),
      x: Math.random() * 85 + 2, // Keep within viewport width (2vw to 87vw)
      size: Math.random() * 50 + 65, // Generous 65px - 115px size for easy mobile tapping
      duration: Math.random() * 4 + 6, // 6s - 10s floating duration
      delay: Math.random() * 12 + 0.2 // Staggered delays starting smoothly
    }));
    setBalloons(initialBalloons);
  }, []);

  const popBalloon = (id: number, type: 'target' | 'distractor') => {
    if (type === 'target') {
      const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2770/2770-preview.mp3');
      audio.volume = 0.5;
      audio.play();
      setPoppedCount(prev => prev + 1);
    }
    // Remove popped balloon and respawn a new one from above to keep plenty on screen
    setBalloons(prev => {
      const remaining = prev.filter(b => b.id !== id);
      const newBalloon = {
        id: Date.now() + Math.random(),
        color: Math.random() > 0.3 ? 'bg-gradient-to-b from-pink-400 to-pink-600 shadow-pink-300/50' : 'bg-gradient-to-b from-purple-400 to-purple-600 shadow-purple-300/50',
        type: Math.random() > 0.2 ? ('target' as const) : ('distractor' as const),
        x: Math.random() * 85 + 2,
        size: Math.random() * 50 + 65,
        duration: Math.random() * 4 + 6,
        delay: Math.random() * 2
      };
      return [...remaining, newBalloon];
    });
  };

  useEffect(() => {
    if (poppedCount >= 29 && !isDone) {
      setIsDone(true);
      const hooray = new Audio('https://assets.mixkit.co/active_storage/sfx/2852/2852-preview.mp3');
      hooray.play();
      confetti({ particleCount: 300, spread: 150, origin: { y: 0.6 } });
      setTimeout(onComplete, 3000);
    }
  }, [poppedCount, isDone, onComplete]);

  return (
    <div className="fixed inset-0 overflow-hidden bg-rose-50 flex items-center justify-center select-none touch-none">
      {isDone ? (
        <motion.div initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-center p-6 bg-white/80 backdrop-blur-md rounded-3xl shadow-xl z-30">
          <h1 className="text-4xl font-extrabold text-pink-600 mb-2">🎉 Happy Birthday Fumane! 🎉</h1>
          <p className="text-pink-900 font-medium">Unlocked with 29 balloons!</p>
        </motion.div>
      ) : (
        <>
          {/* Header Progress Pill */}
          <div className="fixed top-6 left-1/2 -translate-x-1/2 z-20 px-6 py-3 bg-white/80 backdrop-blur-md rounded-full shadow-lg border border-pink-100 text-center pointer-events-none">
            <h2 className="text-lg font-bold text-pink-900">Pop 29 Pink Balloons!</h2>
            <p className="text-sm font-semibold text-pink-600">Popped: {poppedCount} / 29</p>
          </div>

          {/* Floating Balloons */}
          {balloons.map((b) => (
            <motion.div
              key={b.id}
              initial={{ x: `${b.x}vw`, y: '-35vh' }}
              animate={{ 
                y: ['-35vh', '115vh'],
                x: [`${b.x}vw`, `${Math.min(88, Math.max(2, b.x + (Math.random() * 8 - 4)))}vw`, `${b.x}vw`]
              }}
              transition={{
                y: { duration: b.duration, delay: b.delay, repeat: Infinity, ease: 'linear' },
                x: { duration: b.duration / 2, repeat: Infinity, ease: 'easeInOut' }
              }}
              className={`fixed top-0 left-0 rounded-[50%_50%_50%_50%/40%_40%_60%_60%] ${b.color} cursor-pointer shadow-md active:scale-90 transition-transform`}
              style={{ width: `${b.size}px`, height: `${b.size * 1.25}px` }}
              onClick={() => popBalloon(b.id, b.type)}
            >
              {/* Balloon knot */}
              <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-2.5 h-2 bg-pink-700/70 rounded-sm" />
              {/* Gloss highlight reflection */}
              <div className="absolute top-2.5 left-3 w-3 h-6 bg-white/40 rounded-full rotate-[-25deg] blur-[0.5px]" />
            </motion.div>
          ))}
        </>
      )}
    </div>
  );
}

export default function App() {
  const [isLocked, setIsLocked] = useState(true);
  const [uiState, setUiState] = useState<'initial' | 'generating' | 'display' | 'finished'>('initial');
  const [currentVibe, setCurrentVibe] = useState(vibesData[0]);
  const [previousIndex, setPreviousIndex] = useState<number | null>(null);
  const [viewedVibes, setViewedVibes] = useState<Set<number>>(new Set());

  const generateVibe = () => {
    setUiState('generating');
    setTimeout(() => {
      let nextIndex: number;
      
      // Get unviewed indices
      const allIndices = Array.from({ length: vibesData.length }, (_, i) => i);
      const unviewedIndices = allIndices.filter(i => !viewedVibes.has(i));
      
      if (unviewedIndices.length > 0) {
        // Pick from unviewed
        nextIndex = unviewedIndices[Math.floor(Math.random() * unviewedIndices.length)];
      } else {
        // All viewed, reset and pick any
        nextIndex = Math.floor(Math.random() * vibesData.length);
        setViewedVibes(new Set([nextIndex]));
      }
      
      setCurrentVibe(vibesData[nextIndex]);
      setViewedVibes(prev => new Set(prev).add(nextIndex));
      setUiState('display');
    }, 800);
  };

  return (
    <div className="min-h-screen bg-gradient-to-tr from-rose-200 via-pink-100 to-purple-100 flex items-center justify-center p-4">
      {isLocked ? (
        <BalloonPopGame onComplete={() => setIsLocked(false)} />
      ) : (
        <div className="bg-white/40 backdrop-blur-xl border border-white/60 rounded-3xl shadow-2xl p-6 sm:p-8 max-w-sm w-full text-center">
            {/* Banner */}
            <p className="text-xs sm:text-sm text-pink-900/80 italic mb-6">
              May the Lord of peace himself give you peace at all times and in every way
            </p>

            {/* Birthday Message */}
            <p className="text-xl font-bold text-pink-600 mt-2 mb-8">Happy Birthday Fumane!</p>

            {uiState === 'initial' && (
              <div className="space-y-6">
                <p className="text-pink-700">Let's generate Nstwaki's birthday vibe</p>
                <button
                  onClick={generateVibe}
                  className="w-full px-8 py-4 bg-pink-500 text-white rounded-full font-bold shadow-lg hover:bg-pink-600 transition-all active:scale-95"
                >
                  Generate Birthday Vibe
                </button>
              </div>
            )}

            {uiState === 'generating' && (
              <div className="text-pink-800 font-medium py-10">Tuning algorithms...</div>
            )}

            {uiState === 'display' && (
              <div className="space-y-6 animate-fade-in-slide">
                <div className="relative w-full h-64 rounded-2xl overflow-hidden shadow-inner">
                  <img
                    src={currentVibe.imageUrl}
                    alt={currentVibe.vibe_tag}
                    className="w-full h-full object-cover"
                  />
                </div>
                <h2 className="text-3xl font-bold text-rose-900">{currentVibe.vibe_tag}</h2>
                <p className="text-pink-800 text-lg">{currentVibe.message}</p>
                <div className="flex flex-col gap-3">
                  <button
                    onClick={generateVibe}
                    className="w-full px-8 py-4 bg-rose-500 text-white rounded-full font-bold shadow-lg hover:bg-rose-600 transition-all active:scale-95"
                  >
                    Next Vibe
                  </button>
                  {viewedVibes.size >= vibesData.length && (
                    <button
                      onClick={() => setUiState('finished')}
                      className="w-full px-8 py-4 bg-purple-500 text-white rounded-full font-bold shadow-lg hover:bg-purple-600 transition-all active:scale-95"
                    >
                      Finish
                    </button>
                  )}
                </div>
              </div>
            )}
            
            {uiState === 'finished' && (
              <div className="space-y-6 animate-fade-in">
                <h2 className="text-3xl font-bold text-pink-900">System Update Complete.</h2>
                <p className="text-pink-800 text-lg">All data confirms you are officially another year older, and somehow even more awesome.</p>
                <div className="flex flex-col gap-3">
                  <button
                    className="w-full px-8 py-4 bg-green-500 text-white rounded-full font-bold shadow-lg hover:bg-green-600 transition-all active:scale-95"
                    onClick={() => window.location.href = 'https://www.google.com'} // Placeholder
                  >
                    Go Celebrate
                  </button>
                  <button
                    className="w-full px-8 py-4 bg-blue-500 text-white rounded-full font-bold shadow-lg hover:bg-blue-600 transition-all active:scale-95"
                    onClick={() => window.location.href = 'https://www.google.com'} // Placeholder
                  >
                    Go Back to Sleep
                  </button>
                </div>
              </div>
            )}
        </div>
      )}
    </div>
  );
}
