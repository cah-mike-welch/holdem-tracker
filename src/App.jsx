import { useState, useEffect } from 'react';
import HoleCardPicker from './components/HoleCardPicker';
import BettingAction from './components/BettingAction';
import StepNav from './components/StepNav';
import SessionForm from './components/SessionForm';
import { supabase } from './utils/supabaseClient';

export default function App() {
  const [step, setStep] = useState('session');
  const [sessionData, setSessionData] = useState({ name: '', location: '', type: '' });
  const [sessionId, setSessionId] = useState(null);
  const [blindLevel, setBlindLevel] = useState('');
  const [position, setPosition] = useState('');
  const [cards, setCards] = useState([{ rank: '', suit: '' }, { rank: '', suit: '' }]);
  const [handId, setHandId] = useState(null);
  const [showBetting, setShowBetting] = useState(false);

  useEffect(() => {
    console.log('[Debug] sessionId changed:', sessionId);
  }, [sessionId]);

  const handleSessionSubmit = async (e) => {
    e.preventDefault();
    console.log('[Debug] Submitting session form:', sessionData);
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
      console.error('[Debug] Error saving session:', error);
    } else {
      setSessionId(data.session_id);
      setStep('deal');
      console.log('[Debug] Session saved successfully:', data);
    }
  };

  const handleHandSubmit = async (e) => {
    e.preventDefault();
    console.log('[Debug] Submitting hand:', { blindLevel, position, cards });
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
      console.error('[Debug] Error saving hand:', error);
    } else {
      setHandId(data.hand_id);
      setShowBetting(true);
      setStep('preflop');
      console.log('[Debug] Hand saved successfully:', data);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6 flex flex-col items-center">
      <StepNav currentStep={step} heroPosition={position} holeCards={cards} />

      <h1 className="text-2xl font-bold text-blue-700 mb-6">Texas Hold'em Tracker</h1>

      {!sessionId && (
        <SessionForm
          sessionData={sessionData}
          setSessionData={setSessionData}
          onSubmit={handleSessionSubmit}
        />
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

      {showBetting && handId && (
        <BettingAction
          handId={handId}
          blindLevel={blindLevel}
          onRoundChange={(r) => setStep(r)}
          onComplete={() => {
            setBlindLevel('');
            setPosition('');
            setCards([{ rank: '', suit: '' }, { rank: '', suit: '' }]);
            setHandId(null);
            setShowBetting(false);
            setStep('deal');
          }}
        />
      )}
    </div>
  );
}
