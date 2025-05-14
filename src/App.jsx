import { useState } from 'react';
import HoleCardPicker from './HoleCardPicker';
import BettingAction from './BettingAction';
import { supabase } from './supabaseClient';

export default function App() {
  const [sessionData, setSessionData] = useState({
    name: '',
    location: '',
    type: ''
  });
  const [sessionId, setSessionId] = useState(null);
  const [blindLevel, setBlindLevel] = useState('');
  const [position, setPosition] = useState('');
  const [cards, setCards] = useState([
    { rank: '', suit: '' },
    { rank: '', suit: '' }
  ]);
  const [handId, setHandId] = useState(null);
  const [showBetting, setShowBetting] = useState(false);

  const handleSessionSubmit = async (e) => {
    e.preventDefault();
    const { data, error } = await supabase
      .from('sessions')
      .insert([{
        name: sessionData.name,
        location: sessionData.location,
        type: parseInt(sessionData.type)
      }])
      .select()
      .single();

    if (error) {
      console.error('Error saving session:', error);
    } else {
      setSessionId(data.session_id);
      console.log('Session saved:', data);
    }
  };

  const handleHandSubmit = async (e) => {
    e.preventDefault();
    const { data, error } = await supabase
      .from('hands')
      .insert([{
        session_id: sessionId,
        blind_level: blindLevel,
        position,
        card1_rank: cards[0].rank,
        card1_suit: cards[0].suit,
        card2_rank: cards[1].rank,
        card2_suit: cards[1].suit
      }])
      .select()
      .single();

    if (error) {
      console.error('Error saving hand:', error);
    } else {
     setHandId(data.hand_id);
      console.log('returned data = '+data);
      console.log('handid = '+data.hand_id);
      setShowBetting(true);
      console.log('Hand saved:', data);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6 flex flex-col items-center">
      <h1 className="text-2xl font-bold text-blue-700 mb-6">Texas Hold'em Tracker</h1>

      {!sessionId && (
        <form onSubmit={handleSessionSubmit} className="space-y-4 w-full max-w-sm">
          <div>
            <label className="block mb-1 font-semibold">Session Name</label>
            <input
              type="text"
              value={sessionData.name}
              onChange={(e) => setSessionData({ ...sessionData, name: e.target.value })}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div>
            <label className="block mb-1 font-semibold">Location</label>
            <input
              type="text"
              value={sessionData.location}
              onChange={(e) => setSessionData({ ...sessionData, location: e.target.value })}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div>
            <label className="block mb-1 font-semibold">Type</label>
            <select
              value={sessionData.type}
              onChange={(e) => setSessionData({ ...sessionData, type: e.target.value })}
              className="w-full p-2 border rounded"
              required
            >
              <option value="">Select type</option>
              <option value="0">Tournament</option>
              <option value="1">Cash Game</option>
            </select>
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-md font-semibold hover:bg-blue-700"
          >
            Start Session
          </button>
        </form>
      )}

      {sessionId && !showBetting && (
        <form onSubmit={handleHandSubmit} className="space-y-4 w-full max-w-sm">
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
      )}

      {console.log('Showbetting='+showBetting)}
      {console.log('handId='+handId)}
      {showBetting && handId && <BettingAction handId={handId} />}
    </div>
  );
}
