import React from 'react';

const STEPS = ['session', 'deal', 'preflop', 'flop', 'turn', 'river'];

// Optional: helper to convert suit text to emoji
const suitToEmoji = (suit) => {
  switch (suit) {
    case '♠️':
    case '♠': return '♠️';
    case '♥️':
    case '♥': return '♥️';
    case '♦️':
    case '♦': return '♦️';
    case '♣️':
    case '♣': return '♣️';
    default: return suit;
  }
};

export default function StepNav({ currentStep, heroPosition, holeCards }) {
  return (
    <div className="w-full max-w-4xl flex justify-between items-center mb-6 px-4 py-2 bg-white shadow rounded">
      <div className="flex space-x-4">
        {STEPS.map(step => (
          <div
            key={step}
            className={`px-3 py-1 rounded font-semibold text-sm ${
              currentStep === step
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700'
            }`}
          >
            {step.charAt(0).toUpperCase() + step.slice(1)}
          </div>
        ))}
      </div>

      {(heroPosition || (holeCards && holeCards.length === 2)) && (
        <div className="ml-auto text-right text-sm">
          {heroPosition && (
            <div className="font-semibold text-blue-700">Hero: {heroPosition}</div>
          )}
          {holeCards && holeCards.length === 2 && (
            <div className="mt-1">
              {holeCards.map((c, i) => (
                <span
                  key={i}
                  className="inline-block px-2 py-1 border border-gray-300 rounded mx-1 text-lg"
                >
                  {c.rank}{suitToEmoji(c.suit)}
                </span>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
