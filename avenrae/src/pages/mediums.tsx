export default function Mediums() {
  return (
    <div className="min-h-screen bg-white py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-5xl font-bold mb-6 text-gray-800">Our Mediums</h1>
        <p className="text-lg text-gray-600 mb-12">
          Connect with gifted mediums offering spiritual communication and channeling services.
        </p>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="bg-gradient-to-br from-pink-50 to-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition">
              <div className="w-20 h-20 bg-pink-600 rounded-full mb-4"></div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Medium {i}</h3>
              <p className="text-gray-600 mb-4">Spiritual channeling and mediumship services.</p>
              <button className="px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition">
                Schedule Reading
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
