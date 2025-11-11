type Props = {
  placeholder?: string;
  onSearch?: (q: string) => void;
  onSortChange?: (value: string) => void;
  onLocationChange?: (value: string) => void;
  onRatingChange?: (value: string) => void;
};

export default function SearchFilters({
  placeholder = "Search by name, speciality, or keyword",
  onSearch,
  onSortChange,
  onLocationChange,
  onRatingChange,
}: Props) {
  return (
    <div className="bg-white p-4 rounded-2xl shadow mb-6">
      <div className="flex flex-col md:flex-row md:items-center md:space-x-4">
        <div className="flex items-center w-full md:w-2/3">
          <label className="relative flex-1">
            <input
              aria-label="search"
              placeholder={placeholder}
              className="w-full border border-gray-200 rounded-lg px-4 py-3 pr-12 focus:outline-none focus:ring-2 focus:ring-indigo-200"
              onChange={(e) => onSearch && onSearch(e.target.value)}
            />
            <svg
              className="w-5 h-5 absolute right-4 top-3 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 1110.5 3a7.5 7.5 0 016.15 13.65z"
              />
            </svg>
          </label>
        </div>

        <div className="flex items-center mt-3 md:mt-0 space-x-2 w-full md:w-1/3">
          <select
            aria-label="sort"
            className="border border-gray-200 rounded-lg px-3 py-2 text-sm w-1/2"
            onChange={(e) => onSortChange && onSortChange(e.target.value)}
          >
            <option value="relevance">Sort: Relevance</option>
            <option value="rating">Top rated</option>
            <option value="distance">Closest</option>
            <option value="price_low">Price: Low to High</option>
            <option value="price_high">Price: High to Low</option>
          </select>

          <select
            aria-label="rating"
            className="border border-gray-200 rounded-lg px-3 py-2 text-sm w-1/2"
            onChange={(e) => onRatingChange && onRatingChange(e.target.value)}
          >
            <option value="">Rating</option>
            <option value="4">4+ stars</option>
            <option value="3">3+ stars</option>
            <option value="2">2+ stars</option>
          </select>
        </div>
      </div>

      <div className="mt-4 flex flex-col md:flex-row md:items-center md:justify-between md:space-x-4">
        <div className="flex items-center space-x-2">
          <select
            aria-label="location"
            className="border border-gray-200 rounded-lg px-3 py-2 text-sm"
            onChange={(e) => onLocationChange && onLocationChange(e.target.value)}
          >
            <option value="">All locations</option>
            <option value="durban">Durban</option>
            <option value="johannesburg">Johannesburg</option>
            <option value="cape_town">Cape Town</option>
            <option value="online">Online</option>
          </select>

          <button className="px-3 py-2 bg-indigo-100/60 text-indigo-800 rounded-lg text-sm hover:bg-indigo-200 hover:scale-105 hover:shadow-md transition transform">
            Nearby
          </button>
        </div>

        <div className="mt-3 md:mt-0 text-sm text-gray-500">Refine by location, rating or sort order. (UI-only)</div>
      </div>
    </div>
  );
}
