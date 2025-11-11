export default function Events() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-white py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-5xl font-bold mb-6 text-gray-800">Upcoming Events</h1>
        <p className="text-lg text-gray-600 mb-12">
          Join us for workshops, gatherings, and spiritual celebrations.
        </p>
        
        <div className="grid md:grid-cols-2 gap-8">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition border-l-4 border-indigo-600">
              <h3 className="text-2xl font-bold text-gray-800 mb-3">Event {i}</h3>
              <p className="text-gray-600 mb-2">📅 Date: Nov {15 + i}, 2025</p>
              <p className="text-gray-600 mb-2">📍 Location: Avenrae Sanctuary</p>
              <p className="text-gray-600 mb-4">Join us for an enlightening experience connecting spirit and community.</p>
              <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition">
                Register Now
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
