import { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';

const POSITIONS = ['UTG', 'UTG+1', 'MP', 'HJ', 'CO', 'Button', 'SB', 'BB'];
const ROUNDS = ['preflop', 'flop', 'turn', 'river'];

export default function BettingAction({ handId, blindLevel, onComplete }) {
  const [currentRoundIndex, setCurrentRoundIndex] = useState(0);
  const [currentPositionIndex, setCurrentPositionIndex] = useState(0);
  const [roundActions, setRoundActions] = useState({});
  const [foldedPositions, setFoldedPositions] = useState(new Set());
  const [raiseAmount, setRaiseAmount] = useState('');
  const [betAmount, setBetAmount] = useState('');
  const [showRaiseInput, setShowRaiseInput] = useState(false);
  const [showBetInput, setShowBetInput] = useState(false);
  const [showSummary, setShowSummary] = useState(false);
  const [lastBetAmount, setLastBetAmount] = useState(null);

  const round = ROUNDS[currentRoundIndex];
  const position = POSITIONS[currentPositionIndex];

  const getBigBlind = () => {
    const match = blindLevel.match(/\/(\d+)/);
    return match ? parseInt(match[1], 10) : 0;
  };

  useEffect(() => {
    if (currentPositionIndex >= POSITIONS.length) {
      setShowSummary(true);
    }
  }, [currentPositionIndex]);

  const handleAction = (actionType) => {
    if (actionType === 'Raise') {
      setShowRaiseInput(true);
    } else if (actionType === 'Bet') {
      setShowBetInput(true);
    } else {
      const amountToCall = lastBetAmount || (round === 'preflop' ? getBigBlind() : 0);
      const updated = {
        ...roundActions,
        [position]: { action: actionType, amount: actionType === 'Call' ? amountToCall : undefined },
      };
      if (actionType === 'Fold') {
        setFoldedPositions(new Set([...foldedPositions, position]));
      }
      setRoundActions(updated);
      setCurrentPositionIndex(i => i + 1);
    }
  };

  const handleRaiseSubmit = () => {
    const amount = parseInt(raiseAmount, 10);
    const updated = {
      ...roundActions,
      [position]: { action: 'Raise', amount },
    };
    setRoundActions(updated);
    setLastBetAmount(amount);
    setShowRaiseInput(false);
    setRaiseAmount('');
    setCurrentPositionIndex(i => i + 1);
  };

  const handleBetSubmit = () => {
    const amount = parseInt(betAmount, 10);
    const updated = {
      ...roundActions,
      [position]: { action: 'Bet', amount },
    };
    setRoundActions(updated);
    setLastBetAmount(amount);
    setShowBetInput(false);
    setBetAmount('');
    setCurrentPositionIndex(i => i + 1);
  };

  const handleNextRound = async () => {
    const filteredActions = {};
    POSITIONS.forEach(pos => {
      if (!foldedPositions.has(pos) && roundActions[pos]) {
        filteredActions[pos] = roundActions[pos];
      }
    });

    const { error } = await supabase.from('action').insert({
      hand_id: handId,
      round,
      action: filteredActions,
    });

    if (error) {
      console.error('Failed to save action:', error);
    }

    if (currentRoundIndex + 1 < ROUNDS.length) {
      setCurrentRoundIndex(currentRoundIndex + 1);
      setCurrentPositionIndex(0);
      setRoundActions({});
      setLastBetAmount(null);
      setShowSummary(false);
    } else {
      onComplete(); // signal betting is done
    }
  };

  if (showRaiseInput) {
    return (
      <div className="text-center mt-6">
        <label className="block mb-2 font-semibold">Raise amount for {position}:</label>
        <input
          type="number"
          value={raiseAmount}
          onChange={(e) => setRaiseAmount(e.target.value)}
          className="border p-2 rounded w-32 text-center"
        />
        <button onClick={handleRaiseSubmit} className="ml-2 px-4 py-2 bg-blue-600 text-white rounded">Submit</button>
      </div>
    );
  }

  if (showBetInput) {
    return (
      <div className="text-center mt-6">
        <label className="block mb-2 font-semibold">Bet amount for {position}:</label>
        <input
          type="number"
          value={betAmount}
          onChange={(e) => setBetAmount(e.target.value)}
          className="border p-2 rounded w-32 text-center"
        />
        <button onClick={handleBetSubmit} className="ml-2 px-4 py-2 bg-purple-600 text-white rounded">Submit</button>
      </div>
    );
  }

  if (showSummary) {
    return (
      <div className="mt-6 text-center">
        <h3 className="text-lg font-bold mb-4 capitalize">{round} Summary</h3>
        <table className="mx-auto border text-left">
          <thead>
            <tr>
              <th className="px-4 py-2">Position</th>
              <th className="px-4 py-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(roundActions).map(([pos, act]) => (
              <tr key={pos} className="border-t">
                <td className="px-4 py-2">{pos}</td>
                <td className={`px-4 py-2 ${
                  act.action === 'Raise' ? 'font-bold' : act.action === 'Fold' ? 'text-gray-500' : ''
                }`}>
                  {act.action === 'Raise' || act.action === 'Bet'
                    ? `${act.action} to ${act.amount}`
                    : act.action === 'Call'
                    ? `Call for ${act.amount}`
                    : act.action}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <button
          onClick={handleNextRound}
          className="mt-4 px-4 py-2 bg-green-600 text-white rounded"
        >
          Next Round
        </button>
      </div>
    );
  }

  if (foldedPositions.has(position)) {
    setCurrentPositionIndex(i => i + 1);
    return null;
  }

  return (
    <div className="mt-6 text-center">
      <h2 className="text-lg font-bold capitalize mb-2">{round} - {position}</h2>
      <div className="space-x-2">
        <button onClick={() => handleAction('Fold')} className="px-4 py-2 bg-gray-400 text-white rounded">Fold</button>
        <button onClick={() => handleAction('Call')} className="px-4 py-2 bg-yellow-500 text-white rounded">
          Call {lastBetAmount || (round === 'preflop' ? getBigBlind() : '')}
        </button>
        <button onClick={() => handleAction('Raise')} className="px-4 py-2 bg-red-500 text-white rounded">Raise</button>
        {round !== 'preflop' && (
          <>
            <button onClick={() => handleAction('Check')} className="px-4 py-2 bg-blue-400 text-white rounded">Check</button>
            <button onClick={() => handleAction('Bet')} className="px-4 py-2 bg-purple-500 text-white rounded">Bet</button>
          </>
        )}
      </div>
    </div>
  );
}
