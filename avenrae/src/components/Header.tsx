import { Link } from "react-router-dom";

export default function Header() {
  return (
    <header className="bg-white shadow-none sticky top-0 z-50">
      {/* Navigation Bar */}
      <nav className="flex items-center py-4 px-7 justify-between max-w-7xl mx-auto">
        <div className="flex items-center">
          <Link to="/" className="text-2xl font-bold text-gray-700 tracking-wide hover:text-indigo-600 transition">
            Avenrae
          </Link>
          <div className="ml-10">
            <ul className="md:flex space-x-8 hidden">
              <li>
                <Link to="/healers" className="text-gray-800 font-semibold hover:text-indigo-600 transition">
                  Healers
                </Link>
              </li>
              <li>
                <Link to="/prophets" className="text-gray-800 font-semibold hover:text-indigo-600 transition">
                  Prophets
                </Link>
              </li>
              <li>
                <Link to="/mediums" className="text-gray-800 font-semibold hover:text-indigo-600 transition">
                  Mediums
                </Link>
              </li>
              <li>
                <Link to="/events" className="text-gray-800 font-semibold hover:text-indigo-600 transition">
                  Events
                </Link>
              </li>
              <li>
                <Link to="/support" className="text-gray-800 font-semibold hover:text-indigo-600 transition">
                  Support
                </Link>
              </li>
              <li>
                <Link to="/store" className="text-gray-800 font-semibold hover:text-indigo-600 transition">
                  Store
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="lg:flex hidden items-center space-x-3">
          <Link
            to="/auth"
            className="py-1 px-4 bg-indigo-600 text-white rounded-lg transition-all duration-400 transform hover:scale-105 cursor-pointer hover:shadow-lg text-center"
          >
            Log in
          </Link>
          <Link
            to="/auth"
            className="py-1 px-4 border-2 border-indigo-600 text-indigo-600 rounded-lg font-semibold transition-all duration-400 transform hover:scale-105 cursor-pointer hover:bg-indigo-50 text-center"
          >
            Register
          </Link>
        </div>
      </nav>
    </header>
  );
}
