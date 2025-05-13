
import { useState } from 'react';
import HoleCardPicker from './HoleCardPicker';

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
    console.log('Saved hand:', hand);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6 flex flex-col items-center">
      <h1 className="text-2xl font-bold text-blue-700 mb-4">Texas Hold'em Hand Tracker</h1>
      <form onSubmit={handleSubmit} className="space-y-4 w-full max-w-sm">
        <div>
          <label className="block text-sm font-medium mb-1">Blind Level</label>
          <input
            type="text"
            className="w-full p-2 border rounded-md"
            placeholder="e.g. 100/200"
            value={blindLevel}
            onChange={(e) => setBlindLevel(e.target.value)}
          />
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
