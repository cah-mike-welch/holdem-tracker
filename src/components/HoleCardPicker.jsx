import React, { useState } from 'react';
import * as Popover from '@radix-ui/react-popover';

console.log('RADIX POPOVER:', Popover);

const RANKS = ['2', '3', '4', '5', '6', '7', '8', '9', 'T', 'J', 'Q', 'K', 'A'];
const SUITS = [
  { symbol: '♠️', name: 'Spades', color: 'black' },
  { symbol: '♣️', name: 'Clubs', color: 'black' },
  { symbol: '♥️', name: 'Hearts', color: 'red' },
  { symbol: '♦️', name: 'Diamonds', color: 'red' },
];

function CardSelect({ card, onChange }) {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState('rank');

  const handleRankSelect = (rank) => {
    onChange({ ...card, rank });
    setStep('suit');
  };

  const handleSuitSelect = (suit) => {
    onChange({ ...card, suit });
    setStep('rank');
    setOpen(false);
  };

  return (
    <Popover.Root open={open} onOpenChange={setOpen}>
      <Popover.Trigger asChild>
        <button
          type="button"
          className="w-24 h-24 flex items-center justify-center bg-white border rounded-md shadow-sm"
        >
          <div className="flex flex-col items-center justify-center">
            <span className="text-2xl font-bold">{card.rank || 'Rank'}</span>
            <span
              className={`text-3xl ${
                card.suit === '♥️' || card.suit === '♦️'
                  ? 'text-red-600'
                  : 'text-black'
              }`}
            >
              {card.suit || 'Suit'}
            </span>
          </div>
        </button>
      </Popover.Trigger>

      <Popover.Portal>
{/* <Popover.Overlay className="fixed inset-0 bg-black/50 z-40" /> */}

        <Popover.Content
          side="top"
          className="fixed z-50 top-1/2 left-1/2 w-72 -translate-x-1/2 -translate-y-1/2 bg-white rounded-xl p-5 shadow-xl border"
        >
          {step === 'rank' && (
            <>
              <div className="mb-2 text-sm font-bold text-center">Select Rank</div>
              <div className="grid grid-cols-3 gap-2 mb-4">
                {RANKS.map((r) => (
                  <button
                    key={r}
                    onClick={() => handleRankSelect(r)}
                    className="p-3 border rounded text-xl font-semibold hover:bg-blue-100"
                  >
                    {r}
                  </button>
                ))}
              </div>
            </>
          )}

          {step === 'suit' && (
            <>
              <div className="mb-2 text-sm font-bold text-center">Select Suit</div>
              <div className="grid grid-cols-4 gap-2">
                {SUITS.map((s) => (
                  <button
                    key={s.name}
                    onClick={() => handleSuitSelect(s.symbol)}
                    className={`p-3 border rounded text-3xl hover:bg-blue-100 ${
                      s.color === 'red' ? 'text-red-600' : 'text-black'
                    }`}
                  >
                    {s.symbol}
                  </button>
                ))}
              </div>
            </>
          )}
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}

export default function HoleCardPicker({ cards, onCardsChange }) {
  const handleChange = (index, newCard) => {
    const updated = [...cards];
    updated[index] = newCard;
    onCardsChange(updated);
  };

  return (
    <div className="flex justify-center gap-4">
      <CardSelect card={cards[0]} onChange={(card) => handleChange(0, card)} />
      <CardSelect card={cards[1]} onChange={(card) => handleChange(1, card)} />
    </div>
  );
}
