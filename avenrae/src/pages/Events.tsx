export default function Events() {
  const events = [
    {
      id: "e1",
      title: "Breathwork & Reset",
      date: "Nov 20, 2025",
      time: "10:00 AM",
      location: "Durban Hall A",
      host: "Avenrae Wellness",
      description:
        "A guided breathwork session to release stress and restore balance. Bring a yoga mat and water.",
      cover: "",
    },
    {
      id: "e2",
      title: "Community Care Workshop",
      date: "Dec 3, 2025",
      time: "2:00 PM",
      location: "Online",
      host: "Avenrae Collective",
      description:
        "Interactive workshop focused on building supportive community practices for wellbeing.",
      cover: "",
    },
    {
      id: "e3",
      title: "Full Moon Sound Bath",
      date: "Dec 18, 2025",
      time: "7:30 PM",
      location: "Moonlight Studio",
      host: "Nandi Dlamini",
      description:
        "An evening of sound healing to align your energy with the lunar cycle.",
      cover: "",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Left: Highlight / Featured Event */}
        <aside className="md:col-span-1">
          <div className="bg-white rounded-2xl shadow p-4 sticky top-6">
            <div className="h-40 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-500 mb-4 flex items-end p-4 text-white">
              <div>
                <div className="text-sm uppercase font-semibold">Featured</div>
                <h2 className="text-xl font-bold">Breathwork & Reset</h2>
                <div className="text-sm opacity-90">Nov 20 • Durban Hall A</div>
              </div>
            </div>
            <p className="text-sm text-gray-600 mb-4">
              A guided breathwork session to release stress and restore balance. Limited seats available.
            </p>
            <button className="w-full px-4 py-2 bg-indigo-600 text-white rounded-lg mb-2">Get Tickets</button>
            <button className="w-full px-4 py-2 border border-gray-200 rounded-lg">Interested</button>
          </div>

          <div className="bg-white rounded-2xl shadow p-4 mt-6">
            <h3 className="font-semibold mb-3">Your Events</h3>
            <ul className="space-y-3 text-sm text-gray-700">
              <li>Breathwork — Nov 20</li>
              <li>Community Care — Dec 3</li>
            </ul>
            <button className="mt-4 w-full px-3 py-2 bg-indigo-50 text-indigo-700 rounded-lg">Create Event</button>
          </div>
        </aside>

        {/* Center: Event feed */}
        <main className="md:col-span-2">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-bold text-gray-800">Events</h1>
            <div className="flex items-center space-x-2">
              <input
                placeholder="Search events"
                className="border border-gray-200 rounded-lg px-3 py-2 w-64"
              />
              <select className="border border-gray-200 rounded-lg px-3 py-2">
                <option>All</option>
                <option>Online</option>
                <option>In-person</option>
              </select>
            </div>
          </div>

          <div className="space-y-6">
            {events.map((ev) => (
              <article key={ev.id} className="bg-white rounded-2xl shadow-md overflow-hidden">
                <div className="md:flex">
                  <div className="md:w-1/3 h-44 bg-gradient-to-br from-indigo-200 to-purple-200 flex items-center justify-center text-indigo-800 font-semibold">
                    {/* placeholder cover */}
                    <div className="text-center px-4">
                      <div className="text-sm">{ev.date}</div>
                      <div className="text-xl font-bold">{ev.title}</div>
                      <div className="text-sm mt-1 text-gray-700">{ev.location}</div>
                    </div>
                  </div>
                  <div className="md:w-2/3 p-6">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-2xl font-semibold text-gray-800">{ev.title}</h3>
                        <div className="text-sm text-gray-600">{ev.time} • {ev.location}</div>
                        <div className="text-sm text-gray-500 mt-2">Hosted by <span className="font-medium text-gray-700">{ev.host}</span></div>
                      </div>
                      <div className="text-right">
                        <div className="inline-flex bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-sm">Free</div>
                        <div className="mt-3">
                          <button className="px-3 py-2 bg-indigo-600 text-white rounded-lg mr-2">Going</button>
                          <button className="px-3 py-2 border border-gray-200 rounded-lg">Interested</button>
                        </div>
                      </div>
                    </div>

                    <p className="mt-4 text-gray-700">{ev.description}</p>

                    <div className="mt-4 flex items-center justify-between text-sm text-gray-500">
                      <div>• 120 people interested</div>
                      <div className="space-x-3">
                        <button className="text-indigo-600">Share</button>
                        <button className="text-indigo-600">Save</button>
                      </div>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </main>

        {/* Right: Suggestions / Filters */}
        <aside className="md:col-span-1">
          <div className="bg-white rounded-2xl shadow p-4 sticky top-6">
            <h4 className="font-semibold mb-3">Suggested for you</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center justify-between">
                <div>
                  <div className="font-medium">Sound Bath</div>
                  <div className="text-gray-500">Dec 18</div>
                </div>
                <button className="px-3 py-1 bg-indigo-50 text-indigo-700 rounded-lg">View</button>
              </li>
              <li className="flex items-center justify-between">
                <div>
                  <div className="font-medium">Meditation Circle</div>
                  <div className="text-gray-500">Jan 5</div>
                </div>
                <button className="px-3 py-1 bg-indigo-50 text-indigo-700 rounded-lg">View</button>
              </li>
            </ul>
          </div>

          <div className="bg-white rounded-2xl shadow p-4 mt-6 text-sm">
            <h4 className="font-semibold mb-2">Filters</h4>
            <div className="space-y-2">
              <label className="flex items-center space-x-2">
                <input type="checkbox" />
                <span>Free events</span>
              </label>
              <label className="flex items-center space-x-2">
                <input type="checkbox" />
                <span>Online</span>
              </label>
              <label className="flex items-center space-x-2">
                <input type="checkbox" />
                <span>Nearby</span>
              </label>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
