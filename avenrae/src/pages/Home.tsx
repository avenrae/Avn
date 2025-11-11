export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-white">
      {/* Hero Section */}
      <section className="md:flex space-x-16 mt-24 md:mr-0 mr-10">
        <div className="md:flex items-center pl-16">
          <div>
            <h1 className="lg:text-5xl font-bold leading-tight text-3xl text-gray-800">
              Where Spirit Meets Technology
            </h1>
            <p className="mt-5 text-lg text-gray-600 font-light leading-relaxed">
              Avenrae bridges science and soul — empowering healers, prophets, and seekers 
              to connect through light, intention, and innovation.  
              A digital sanctuary built for restoration, purpose, and modern healing.
            </p>
            <div className="flex mt-10 w-44 items-center justify-center space-x-3 py-2 px-2 bg-indigo-600 text-white rounded-lg transition-all duration-400 transform hover:scale-105 cursor-pointer hover:shadow-lg">
              <button className="text-lg font-medium">Begin Your Journey</button>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Sections */}
      <section className="max-w-6xl mx-auto py-20 px-4">
        <h2 className="text-4xl font-bold text-center mb-16 text-gray-800">
          Our Services
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="p-8 bg-white rounded-2xl shadow-lg hover:shadow-xl transition">
            <h3 className="text-2xl font-bold text-indigo-600 mb-4">Healers</h3>
            <p className="text-gray-600">
              Connect with experienced healers offering holistic wellness and restoration services.
            </p>
          </div>
          <div className="p-8 bg-white rounded-2xl shadow-lg hover:shadow-xl transition">
            <h3 className="text-2xl font-bold text-indigo-600 mb-4">Prophets</h3>
            <p className="text-gray-600">
              Seek guidance and spiritual insight from trusted prophetic practitioners.
            </p>
          </div>
          <div className="p-8 bg-white rounded-2xl shadow-lg hover:shadow-xl transition">
            <h3 className="text-2xl font-bold text-indigo-600 mb-4">Mediums</h3>
            <p className="text-gray-600">
              Explore spiritual communication and channeling services with gifted mediums.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
