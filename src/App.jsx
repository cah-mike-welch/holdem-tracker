
import { useState } from 'react';
import HoleCardPicker from './HoleCardPicker';
import { submitToGoogleSheet } from './utils/submitToGoogleSheets.js';

export default function App() {
  const [blindLevel, setBlindLevel] = useState('');
  const [position, setPosition] = useState('');
  const [cards, setCards] = useState([
    { rank: '', suit: '' },
    { rank: '', suit: '' }
  ]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const hand = {
      blindLevel,
      position,
      cards,
      timestamp: new Date().toISOString()
    };
    submitToGoogleSheet(hand);
    console.log('Saved hand:', hand);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6 flex flex-col items-center">
      <h1 className="text-2xl font-bold text-blue-700 mb-4">Texas Hold'em Hand Tracker XXX</h1>
      <form onSubmit={handleSubmit} className="space-y-4 w-full max-w-sm">
        <div>
          <label className="block mb-2 font-semibold">Blind Level</label>
            <select
              value={blindLevel}
              onChange={(e) => setBlindLevel(e.target.value)}
              className="w-full p-2 border rounded"
            >
              {[
                'Level 1: 100/200 (200)',
                'Level 2: 200/300 (300)',
                'Level 3: 200/400 (400)',
                'Level 4: 300/500 (500)',
                'Level 5: 300/600 (600)',
                'Level 6: 400/800 (800)',
                'Level 7: 500/1,000 (1,000)',
                'Level 8: 600/1,200 (1,200)',
                'Level 9: 800/1,600 (1,600)',
                'Level 10: 1,000/2,000 (2,000)',
                'Level 11: 1,200/2,400 (2,400)',
                'Level 12: 1,500/3,000 (3,000)',
                'Level 13: 2,000/4,000 (4,000)',
                'Level 14: 2,500/5,000 (5,000)',
                'Level 15: 3,000/6,000 (6,000)',
              ].map((level, index) => (
                <option key={index} value={level}>
                  {level}
                </option>
              ))}
            </select>

        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Position</label>
          <select
            className="w-full p-2 border rounded-md"
            value={position}
            onChange={(e) => setPosition(e.target.value)}
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
          <label className="block text-sm font-medium mb-1">Hole Cards</label>
          <HoleCardPicker cards={cards} onCardsChange={setCards} />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded-md font-semibold hover:bg-blue-700"
        >
          Save
        </button>
      </form>
    </div>
  );
}
