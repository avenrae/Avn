import React from "react";
import './App.css'

export default function Header() {
  return (
    <header className="min-h-screen bg-white">
      {/* Navigation Bar */}
      <nav className="flex items-center py-4 px-7 justify-between">
        <div className="flex items-center">
          <h1 className="text-2xl font-bold text-gray-700">Avenrae</h1>
          <div className="ml-10">
            <ul className="md:flex space-x-8 hidden">
              <li><a href="#" className="text-gray-800 font-semibold">Healers</a></li>
              <li><a href="#" className="text-gray-800 font-semibold">Prophets</a></li>
              <li><a href="#" className="text-gray-800 font-semibold">Medium</a></li>
              <li><a href="#" className="text-gray-800 font-semibold">Events</a></li>
              <li><a href="#" className="text-gray-800 font-semibold">Support</a></li> | 
              <li><a href="#" className="text-gray-800 font-semibold">Store</a></li>
            </ul>
          </div>
        </div>

        <div className="lg:flex hidden items-center py-3 px-5 bg-blue-400 text-white rounded-lg transition-all">
          <div>log in</div>
        </div>
      </nav>
  
      <div className="md:flex space-x-16 mt-20 md:mr-0 mr-10">
        {/* Left Box */}
        <div className="md:flex items-center pl-16">
          <div>
            <h1 className="lg:text-5xl font-bold leading-tight text-3xl">
              Elegant Landing Pages for your next project
            </h1>
            <p className="mt-4 text-lg font-normal">
              Build your site in a few seconds based on ready-to-use blocks and sections,<br />it's a lot of fun.
            </p>
            <div className="flex mt-10 w-40 items-center space-x-3 py-3 px-6 bg-indigo-600 text-white rounded-lg transition-all duration-400 transform hover:scale-105 cursor-pointer hover:shadow-lg">
              <button className="text-lg">Book Now</button>
            </div>
          </div>
        </div>
      
      </div>
    </header>
  );
}
