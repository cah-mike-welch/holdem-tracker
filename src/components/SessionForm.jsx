import React from 'react';

export default function SessionForm({ sessionData, setSessionData, onSubmit }) {
  return (
    <form onSubmit={onSubmit} className="space-y-4 w-full max-w-sm">
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
  );
}
