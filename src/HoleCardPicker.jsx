import * as Popover from '@radix-ui/react-popover';
import { useState } from 'react';

const RANKS = ['2', '3', '4', '5', '6', '7', '8', '9', 'T', 'J', 'Q', 'K', 'A'];
const SUITS = [
  { symbol: '♠️', name: 'Spades', color: 'black' },
  { symbol: '♣️', name: 'Clubs', color: 'black' },
  { symbol: '♥️', name: 'Hearts', color: 'red' },
  { symbol: '♦️', name: 'Diamonds', color: 'red' },
];

function CardSelect({ card, onChange }) {
  const [open, setOpen] = useState(false);

  return (
    <Popover.Root open={open} onOpenChange={setOpen}>
      <Popover.Trigger asChild>
        <button
          type="button"
          className="flex flex-col items-center justify-center w-24 h-24 bg-white border rounded-md shadow-sm"
        >
          <span className="text-2xl font-bold">
            {card.rank || 'Rank'}
          </span>
          <span
            className={`text-3xl ${
              card.suit === '♥️' || card.suit === '♦️'
                ? 'text-red-600'
                : 'text-black'
            }`}
          >
            {card.suit || 'Suit'}
          </span>
        </button>
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Content
          side="top"
          className="z-50 p-4 bg-white rounded-lg shadow-lg w-64 border"
        >
          <div className="mb-2 text-sm font-bold">Select Rank</div>
          <div className="grid grid-cols-3 gap-2 mb-4">
            {RANKS.map((r) => (
              <button
                key={r}
                onClick={() => {
                  onChange({ ...card, rank: r });
                }}
                className="p-3 border rounded text-xl font-semibold hover:bg-blue-100"
              >
                {r}
              </button>
            ))}
          </div>
          <div className="mb-2 text-sm font-bold">Select Suit</div>
          <div className="grid grid-cols-4 gap-2">
            {SUITS.map((s) => (
              <button
                key={s.name}
                onClick={() => {
                  onChange({ ...card, suit: s.symbol });
                  setOpen(false); // close on suit select
                }}
                className={`p-3 border rounded text-3xl hover:bg-blue-100 ${
                  s.color === 'red' ? 'text-red-600' : 'text-black'
                }`}
              >
                {s.symbol}
              </button>
            ))}
          </div>
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}

export default function HoleCardPicker({ onCardsChange }) {
  const [card1, setCard1] = useState({ rank: '', suit: '' });
  const [card2, setCard2] = useState({ rank: '', suit: '' });

  const notifyChange = () => {
    onCardsChange?.([card1, card2]);
  };

  return (
    <div className="flex justify-center gap-4">
      <CardSelect card={card1} onChange={(newCard) => { setCard1(newCard); notifyChange(); }} />
      <CardSelect card={card2} onChange={(newCard) => { setCard2(newCard); notifyChange(); }} />
    </div>
  );
}
