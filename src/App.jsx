import { useState } from 'react';
import HoleCardPicker from './HoleCardPicker';
import { supabase } from './supabaseClient';

export default function App() {
  const [sessionCreated, setSessionCreated] = useState(false);
  const [sessionId, setSessionId] = useState(null);
  const [sessionName, setSessionName] = useState('');
  const [location, setLocation] = useState('');
  const [type, setType] = useState('0');

  const [blindLevel, setBlindLevel] = useState('');
  const [position, setPosition] = useState('');
  const [cards, setCards] = useState([
    { rank: '', suit: '' },
    { rank: '', suit: '' }
  ]);

   // ✅ Add this here
  const formIsValid =
    blindLevel &&
    position &&
    cards[0].rank &&
    cards[0].suit &&
    cards[1].rank &&
    cards[1].suit;

  const handleCreateSession = async (e) => {
    e.preventDefault();
    const { data, error } = await supabase
      .from('sessions')
      .insert([{ name: sessionName, location, type: parseInt(type) }])
      .select()
      .single();

    if (error) {
      console.error('Error creating session:', error);
      return;
    }

    setSessionId(data.session_id);
    setSessionCreated(true);
    console.log('Session created:', data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const hand = {
      session_id: sessionId,
      blind_level: blindLevel,
      position: position,
      card1_rank: cards[0].rank,
      card1_suit: cards[0].suit,
      card2_rank: cards[1].rank,
      card2_suit: cards[1].suit,
      created_at: new Date().toISOString()
    };

    const { error } = await supabase.from('hands').insert([hand]);
    if (error) {
      console.error('Error saving hand:', error);
    } else {
      console.log('Saved hand:', hand);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6 flex flex-col items-center">
      <h1 className="text-2xl font-bold text-blue-700 mb-4">Texas Hold'em Hand Tracker</h1>

      {!sessionCreated ? (
        <form onSubmit={handleCreateSession} className="space-y-4 w-full max-w-sm">
          <div>
            <label className="block mb-2 font-semibold">Session Name</label>
            <input
              type="text"
              value={sessionName}
              onChange={(e) => setSessionName(e.target.value)}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div>
            <label className="block mb-2 font-semibold">Location</label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div>
            <label className="block mb-2 font-semibold">Game Type</label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="w-full p-2 border rounded"
            >
              <option value="0">Tournament</option>
              <option value="1">Cash Game</option>
            </select>
          </div>
          <button
            type="submit"
            className="w-full bg-green-600 text-white py-2 rounded-md font-semibold hover:bg-green-700"
          >
            Create Session
          </button>
        </form>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4 w-full max-w-sm">
          <div>
            <label className="block mb-2 font-semibold">Blind Level</label>
            <select
              value={blindLevel}
              onChange={(e) => setBlindLevel(e.target.value)}
              className="w-full p-2 border rounded"
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
          disabled={!formIsValid}
          className={`w-full py-2 rounded-md font-semibold ${
            formIsValid
              ? 'bg-blue-600 text-white hover:bg-blue-700'
              : 'bg-gray-300 text-gray-600 cursor-not-allowed'
          }`}
        >
          Save
        </button>
        </form>
      )}
    </div>
  );
}
