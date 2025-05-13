import HoleCardPicker from './HoleCardPicker';

export default function App() {
  const handleCardChange = (cards) => {
    console.log('Selected cards:', cards);
    // You could set state or save these to localStorage here
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col p-4">
      <h1 className="text-xl font-bold text-center text-blue-600 mb-4">
        Texas Hold'em Hand Tracker
      </h1>

      <form className="flex flex-col items-center space-y-4 w-full">
        <div className="w-64">
          <label className="block text-sm font-medium mb-1 text-center">Blind Level</label>
          <input
            type="text"
            className="w-full p-2 border rounded-md"
            placeholder="e.g. 50/100"
          />
        </div>

        <div className="w-64">
          <label className="block text-sm font-medium mb-1 text-center">Position</label>
          <select className="w-full p-2 border rounded-md">
            <option value="">--</option>
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

        <div className="w-64">
          <label className="block text-sm font-medium mb-1 text-center">Hole Cards</label>
          <HoleCardPicker onCardsChange={handleCardChange} />
        </div>

        <button
          type="submit"
          className="bg-blue-600 text-white py-2 px-4 rounded-md font-semibold hover:bg-blue-700"
        >
          Save Hand
        </button>
      </form>

    </div>
  );
}
