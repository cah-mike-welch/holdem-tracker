import React from 'react';
import HoleCardPicker from './HoleCardPicker';

export default function HandForm({ blindLevel, setBlindLevel, position, setPosition, cards, setCards, onSubmit }) {
  return (
    <form onSubmit={onSubmit} className="space-y-4 w-full max-w-sm">
      <div>
        <label className="block mb-2 font-semibold">Blind Level</label>
        <select
          value={blindLevel}
          onChange={(e) => setBlindLevel(e.target.value)}
          className="w-full p-2 border rounded"
          required
        >
          <option value="">Select blind level</option>
          {[...Array(15)].map((_, index) => {
            const level = index + 1;
            const sb = [100, 200, 200, 300, 300, 400, 500, 600, 800, 1000, 1200, 1500, 2000, 2500, 3000][index];
            const bb = sb * 2;
            return (
              <option key={level} value={`Level ${level}: ${sb}/${bb} (${bb})`}>
                Level {level}: {sb}/{bb} ({bb})
              </option>
            );
          })}
        </select>
      </div>
      <div>
        <label className="block mb-1 font-semibold">Position</label>
        <select
          value={position}
          onChange={(e) => setPosition(e.target.value)}
          className="w-full p-2 border rounded"
          required
        >
          <option value="">Select position</option>
          <option>UTG</option>
          <option>UTG+1</option>
          <option>MP</option>
          <option>HJ</option>
          <option>CO</option>
          <option>Button</option>
          <option>SB</option>
          <option>BB</option>
        </select>
      </div>
      <div>
        <label className="block mb-1 font-semibold">Hole Cards</label>
        <HoleCardPicker cards={cards} onCardsChange={setCards} />
      </div>
      <button
        type="submit"
        className="w-full bg-green-600 text-white py-2 rounded-md font-semibold hover:bg-green-700"
        disabled={!blindLevel || !position || cards.some(c => !c.rank || !c.suit)}
      >
        Save Hand
      </button>
    </form>
  );
}
