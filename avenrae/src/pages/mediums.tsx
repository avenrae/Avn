import SearchFilters from "../components/SearchFilters";
import reactLogo from "../assets/react.svg";

export default function Mediums() {
  return (
    <div className="min-h-screen bg-white py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold mb-4 text-gray-800">Our Mediums</h1>
        <p className="text-lg text-gray-600 mb-6">
          Connect with gifted mediums offering spiritual communication and channeling services.
        </p>

        <SearchFilters placeholder="Search mediums, mediumship or locations" />

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="bg-gradient-to-br from-pink-50 to-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition">
              <div className="flex items-center space-x-4 mb-4">
                <img src={reactLogo} alt={`Medium ${i}`} className="w-20 h-20 object-contain flex-shrink-0" />
                <h3 className="text-xl font-bold text-gray-800">Medium {i}</h3>
              </div>
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
