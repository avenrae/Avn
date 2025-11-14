import { useNavigate } from "react-router-dom";
import SearchFilters from "../components/SearchFilters";
import reactLogo from "../assets/react.svg";

export default function Healers() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold mb-4 text-gray-800">Our Healers</h1>
        <p className="text-lg text-gray-600 mb-6">
          Discover experienced healing practitioners dedicated to your wellness and restoration.
        </p>

        <SearchFilters placeholder="Search healers, specialties or locations" />

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="bg-gradient-to-br from-indigo-50 to-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition">
              <div className="flex items-center space-x-4 mb-4">
                <img src={reactLogo} alt={`Healer ${i}`} className="w-20 h-20 object-contain flex-shrink-0" />
                <h3 className="text-xl font-bold text-gray-800">Healer {i}</h3>
              </div>
              <p className="text-gray-600 mb-4">Specialized in holistic wellness and energy healing.</p>
              <button 
                onClick={() => navigate("/booking")}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition">
                Book Now
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
