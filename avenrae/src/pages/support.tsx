export default function Support() {
  return (
    <div className="min-h-screen bg-white py-20 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-5xl font-bold mb-6 text-gray-800">Support & Help</h1>
        <p className="text-lg text-gray-600 mb-12">
          We're here to help. Find answers to common questions and get in touch with our team.
        </p>
        
        <div className="space-y-8">
          {[
            { title: "Getting Started", desc: "Learn how to create an account and browse our practitioners." },
            { title: "Booking Sessions", desc: "Find guidance on scheduling and managing your appointments." },
            { title: "Payments & Refunds", desc: "Information about billing, payment methods, and refund policies." },
            { title: "Technical Issues", desc: "Troubleshoot common technical problems." },
          ].map((item, i) => (
            <div key={i} className="bg-gradient-to-r from-indigo-50 to-purple-50 p-8 rounded-2xl shadow-md hover:shadow-lg transition">
              <h3 className="text-2xl font-bold text-gray-800 mb-3">{item.title}</h3>
              <p className="text-gray-600 mb-4">{item.desc}</p>
              <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition">
                Learn More
              </button>
            </div>
          ))}
        </div>

        <div className="mt-12 bg-indigo-100 p-8 rounded-2xl text-center">
          <h3 className="text-2xl font-bold text-gray-800 mb-4">Still need help?</h3>
          <p className="text-gray-600 mb-6">Contact our support team</p>
          <button className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition">
            Contact Support
          </button>
        </div>
      </div>
    </div>
  );
}
