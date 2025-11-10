import React from "react";
import './App.css'

export default function App() {
  const professionals = [
    { id: 1, name: "Dr. Lerato Khumalo", role: "Psychologist", price: "R450 / session" },
    { id: 2, name: "Dr. Sipho Mokoena", role: "Optometrist", price: "R300 / consult" },
    { id: 3, name: "Nandi Dlamini", role: "Counsellor", price: "R250 / session" },
    { id: 4, name: "Thabo Nkosi", role: "Spiritual Healer", price: "R200 / session" }
  ];

  const events = [
    { id: 1, title: "Breathwork & Reset", date: "Nov 20, 2025", location: "Durban - Hall A" },
    { id: 2, title: "Community Care Workshop", date: "Dec 3, 2025", location: "Online" }
  ];

  return (
    <div className="bg-gray-50 text-gray-800 font-sans">
      {/* Navbar */}
      <header className="bg-white shadow-md sticky top-0 z-50">
        <div className="max-w-6xl mx-auto flex items-center justify-between p-4">
          <h1 className="text-2xl font-bold text-indigo-600">Avenrae</h1>
          <nav className="hidden md:flex space-x-6">
            <a href="#about" className="hover:text-indigo-600">About</a>
            <a href="#professionals" className="hover:text-indigo-600">Professionals</a>
            <a href="#events" className="hover:text-indigo-600">Events</a>
            <a href="#contact" className="hover:text-indigo-600">Contact</a>
          </nav>
          <button
            className="md:hidden p-2 border rounded"
            onClick={() => {
              const menu = document.getElementById("mobileMenu");
              menu.classList.toggle("hidden");
            }}
          >
            ☰
          </button>
        </div>
        <nav id="mobileMenu" className="hidden flex-col space-y-2 bg-white p-4 md:hidden">
          <a href="#about" className="block hover:text-indigo-600">About</a>
          <a href="#professionals" className="block hover:text-indigo-600">Professionals</a>
          <a href="#events" className="block hover:text-indigo-600">Events</a>
          <a href="#contact" className="block hover:text-indigo-600">Contact</a>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="text-center py-20 bg-gradient-to-b from-indigo-100 to-white">
        <h2 className="text-4xl md:text-5xl font-bold mb-4 text-indigo-700">
          Rays of Life. Paths of Healing.
        </h2>
        <p className="text-lg text-gray-600 max-w-xl mx-auto mb-8">
          Avenrae connects you with professionals who restore balance to your body, mind, and spirit.
          We bring therapy, wellness, and holistic care together in one digital sanctuary.
        </p>
        <a
          href="#professionals"
          className="bg-indigo-600 text-white px-6 py-3 rounded-full hover:bg-indigo-700 transition"
        >
          Meet the Healers
        </a>
      </section>

      {/* Professionals */}
      <section id="professionals" className="max-w-6xl mx-auto py-16 px-4">
        <h3 className="text-3xl font-bold text-center mb-10">Our Professionals</h3>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {professionals.map((pro) => (
            <div
              key={pro.id}
              className="bg-white p-6 rounded-2xl shadow hover:shadow-lg transition"
            >
              <h4 className="font-semibold text-lg text-indigo-700">{pro.name}</h4>
              <p>{pro.role}</p>
              <p className="mt-2 font-medium text-gray-600">{pro.price}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Events */}
      <section id="events" className="bg-indigo-50 py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h3 className="text-3xl font-bold text-center mb-10">Upcoming Events</h3>
          <div className="grid md:grid-cols-2 gap-8">
            {events.map((ev) => (
              <div
                key={ev.id}
                className="bg-white p-6 rounded-2xl shadow hover:shadow-lg transition"
              >
                <h4 className="text-xl font-semibold text-indigo-700 mb-2">
                  {ev.title}
                </h4>
                <p className="text-gray-600">
                  {ev.date} — {ev.location}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About */}
      <section id="about" className="max-w-5xl mx-auto py-16 px-4 text-center">
        <h3 className="text-3xl font-bold mb-6">About Avenrae</h3>
        <p className="text-gray-600 leading-relaxed max-w-2xl mx-auto">
          Avenrae was founded on the belief that healing is both science and spirit.
          We partner with trusted professionals across psychology, optometry,
          counselling, and traditional healing to offer accessible, modern wellness.
        </p>
      </section>

      {/* Contact */}
      <section id="contact" className="bg-indigo-100 py-16">
        <div className="max-w-3xl mx-auto text-center px-4">
          <h3 className="text-3xl font-bold mb-6 text-indigo-700">Get in Touch</h3>
          <p className="text-gray-600 mb-8">
            Interested in joining our network or hosting an event?
            Reach out and let’s build something healing together.
          </p>
          <a
            href="mailto:contact@avenrae.com"
            className="bg-indigo-600 text-white px-6 py-3 rounded-full hover:bg-indigo-700 transition"
          >
            contact@avenrae.com
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 text-center py-6 text-sm">
        <p>&copy; 2025 Avenrae. All rights reserved.</p>
      </footer>
    </div>
  );
}
