import { useNavigate } from "react-router-dom";
import SearchFilters from "../components/SearchFilters";
import reactLogo from "../assets/react.svg";

export default function Prophets() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold mb-4 text-gray-800">Our Prophets</h1>
        <p className="text-lg text-gray-600 mb-6">
          Seek spiritual guidance and insight from our trusted prophetic practitioners.
        </p>

        <SearchFilters placeholder="Search prophets, topics or locations" />

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="bg-gradient-to-br from-purple-50 to-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition">
              <div className="flex items-center space-x-4 mb-4">
                <img src={reactLogo} alt={`Prophet ${i}`} className="w-20 h-20 object-contain flex-shrink-0" />
                <h3 className="text-xl font-bold text-gray-800">Prophet {i}</h3>
              </div>
              <p className="text-gray-600 mb-4">Guided spiritual readings and prophetic counsel.</p>
              <button 
                onClick={() => navigate("/booking")}
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition">
                Book Session
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
