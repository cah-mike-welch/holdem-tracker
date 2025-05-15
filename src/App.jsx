import { useState } from 'react';
import SessionForm from './components/SessionForm';
import HandForm from './components/HandForm';
import BettingAction from './components/BettingAction';
import { supabase } from './supabaseClient';

export default function App() {
  const [sessionData, setSessionData] = useState({ name: '', location: '', type: '' });
  const [sessionId, setSessionId] = useState(null);
  const [blindLevel, setBlindLevel] = useState('');
  const [position, setPosition] = useState('');
  const [cards, setCards] = useState([{ rank: '', suit: '' }, { rank: '', suit: '' }]);
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

    if (error) console.error(error);
    else setSessionId(data.session_id);
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

    if (error) console.error(error);
    else {
      setHandId(data.hand_id);
      setShowBetting(true);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6 flex flex-col items-center">
      <h1 className="text-2xl font-bold text-blue-700 mb-6">Texas Hold'em Tracker</h1>

      {!sessionId && (
        <SessionForm sessionData={sessionData} setSessionData={setSessionData} onSubmit={handleSessionSubmit} />
      )}

      {sessionId && !showBetting && (
        <HandForm
          blindLevel={blindLevel}
          setBlindLevel={setBlindLevel}
          position={position}
          setPosition={setPosition}
          cards={cards}
          setCards={setCards}
          onSubmit={handleHandSubmit}
        />
      )}

      {showBetting && handId && (
        <BettingAction
          handId={handId}
          blindLevel={blindLevel}
          onComplete={() => {
            setBlindLevel('');
            setPosition('');
            setCards([{ rank: '', suit: '' }, { rank: '', suit: '' }]);
            setHandId(null);
            setShowBetting(false);
          }}
        />
      )}
    </div>
  );
}
