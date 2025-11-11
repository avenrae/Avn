export default function Store() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-5xl font-bold mb-6 text-gray-800">Avenrae Store</h1>
        <p className="text-lg text-gray-600 mb-12">
          Explore spiritual tools, crystals, books, and wellness products.
        </p>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <div key={i} className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition overflow-hidden">
              <div className="w-full h-40 bg-gradient-to-br from-amber-200 to-yellow-300 rounded-lg mb-4"></div>
              <h3 className="text-lg font-bold text-gray-800 mb-2">Product {i}</h3>
              <p className="text-gray-600 text-sm mb-4">Premium spiritual wellness product</p>
              <div className="flex justify-between items-center">
                <span className="text-lg font-bold text-indigo-600">R{i * 50}</span>
                <button className="px-3 py-1 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition text-sm">
                  Add to Cart
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
