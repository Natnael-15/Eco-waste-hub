import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const games = [
  {
    title: 'Alien Invaders 2',
    src: 'https://cdn.htmlgames.com/AlienInvaders2/',
    width: 800,
    height: 480,
    img: '/assets/alieninvaders2300200.webp',
  },
  {
    title: 'Wood Block Puzzle',
    src: 'https://cdn.htmlgames.com/WoodBlockPuzzle/',
    width: 800,
    height: 480,
    img: '/assets/woodblockpuzzle300200.webp',
  },
  {
    title: 'Connect The Bubbles',
    src: 'https://cdn.htmlgames.com/ConnectTheBubbles/',
    width: 800,
    height: 480,
    img: '/assets/connect-the-bubbles-300.webp',
  },
];

const GameArcade: React.FC = () => {
  const [selected, setSelected] = useState<number | null>(null);
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center min-h-screen bg-gradient-to-br from-gray-900 via-eco-green/30 to-gray-950 py-8">
      <button
        onClick={() => navigate(-1)}
        className="absolute top-6 left-6 bg-eco-yellow text-eco-green font-bold px-4 py-2 rounded-full shadow hover:bg-yellow-300 transition z-10"
      >
        ← Back
      </button>
      <h1 className="text-3xl md:text-4xl font-bold text-eco-yellow mb-4 font-playfair drop-shadow-lg">Game Arcade</h1>
      <div className="mb-8 text-center max-w-2xl mx-auto">
        <div className="relative flex items-center justify-center">
          <span className="absolute -left-8 top-1/2 -translate-y-1/2 animate-wiggle text-3xl md:text-4xl select-none drop-shadow-lg">💡</span>
          <div className="bg-white/60 dark:bg-gray-900/80 backdrop-blur-lg border-2 border-eco-yellow/60 shadow-xl rounded-2xl px-6 py-4 font-semibold text-lg md:text-xl text-eco-green dark:text-eco-yellow flex-1 animate-fadeInSlide">
            We run <span className="text-eco-yellow font-bold">ads</span> on these games to raise money for our mission—so every time you play, you help support <span className="text-eco-green dark:text-eco-yellow font-bold">Eco Waste Hub</span>!
          </div>
        </div>
      </div>
      <div className="flex flex-1 items-center justify-center w-full" style={{ minHeight: '60vh' }}>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 w-full max-w-6xl">
          {games.map((game, idx) => (
            <div
              key={game.title}
              className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-xl p-6 flex flex-col items-center transition transform hover:scale-105 hover:bg-white/20 border border-eco-yellow/30 group"
              style={{ minWidth: 260 }}
            >
              <img
                src={game.img}
                alt={game.title}
                className="rounded-xl mb-4 w-full h-36 object-cover shadow group-hover:shadow-lg transition"
                style={{ maxWidth: 220 }}
              />
              <h2 className="text-xl font-bold text-eco-yellow mb-2 text-center drop-shadow">{game.title}</h2>
              <button
                className="bg-eco-green text-white px-8 py-2 rounded-full font-semibold shadow hover:bg-eco-green/90 transition mt-2 text-lg"
                onClick={() => setSelected(idx)}
              >
                Play
              </button>
            </div>
          ))}
        </div>
      </div>
      {/* Modal for game */}
      {selected !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 animate-fadeIn">
          <div
            className="relative bg-gradient-to-br from-gray-900/95 via-eco-green/40 to-gray-950/95 border-2 border-eco-yellow rounded-3xl shadow-2xl p-0 w-full max-w-3xl mx-4 flex flex-col items-center animate-fadeInModal"
            style={{ overflow: 'hidden' }}
          >
            <button
              className="absolute top-4 right-4 text-eco-green bg-eco-yellow rounded-full px-3 py-1 font-bold shadow hover:bg-yellow-300 hover:scale-110 transition text-xl z-10"
              onClick={() => setSelected(null)}
              aria-label="Close"
            >
              ✕
            </button>
            <h2 className="text-2xl font-bold text-eco-yellow mb-2 mt-6 text-center drop-shadow">{games[selected].title}</h2>
            <div className="w-full flex justify-center items-center" style={{ minHeight: games[selected].height }}>
              <iframe
                src={games[selected].src}
                width={games[selected].width}
                height={games[selected].height}
                frameBorder="0"
                scrolling="no"
                allowFullScreen
                title={games[selected].title}
                className="rounded-2xl border border-eco-yellow shadow-lg bg-black"
                style={{ width: '100%', maxWidth: games[selected].width, height: games[selected].height, background: '#111' }}
              />
            </div>
            <div className="mb-4" />
          </div>
        </div>
      )}
      {/* Animations */}
      <style>{`
        @keyframes wiggle {
          0%, 100% { transform: rotate(-8deg); }
          50% { transform: rotate(8deg); }
        }
        .animate-wiggle {
          animation: wiggle 1.2s infinite ease-in-out;
        }
        @keyframes fadeInSlide {
          from { opacity: 0; transform: translateY(-24px) scale(0.98); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        .animate-fadeInSlide {
          animation: fadeInSlide 0.5s cubic-bezier(.4,1.6,.6,1) forwards;
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease;
        }
        @keyframes fadeInModal {
          from { opacity: 0; transform: translateY(40px) scale(0.98); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        .animate-fadeInModal {
          animation: fadeInModal 0.35s cubic-bezier(.4,1.6,.6,1) forwards;
        }
      `}</style>
    </div>
  );
};

export default GameArcade; 