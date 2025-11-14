import { useState } from 'react';
import Calendar from '../components/Calendar';
import reactLogo from '../assets/react.svg';

interface TimeSlot {
  id: string;
  time: string;
  available: boolean;
  price: number;
}

export default function Booking() {
  // Mock practitioner data (will be replaced with real API call)
  const practitioner = {
    id: '1',
    name: 'Dr. Lerato Khumalo',
    specialty: 'Psychologist',
    rating: 4.8,
    reviews: 127,
    image: reactLogo,
    bio: 'Specialized in holistic wellness and energy healing.',
    price: 450, // R450 per session
    duration: 60, // minutes
    location: 'Durban, South Africa',
  };

  // State management
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    notes: '',
    agreeTerms: false,
  });

  // Mock availability slots (will come from API)
  const timeSlots: TimeSlot[] = [
    { id: '1', time: '09:00 - 10:00', available: true, price: practitioner.price },
    { id: '2', time: '10:15 - 11:15', available: true, price: practitioner.price },
    { id: '3', time: '11:30 - 12:30', available: false, price: practitioner.price },
    { id: '4', time: '13:00 - 14:00', available: true, price: practitioner.price },
    { id: '5', time: '14:15 - 15:15', available: true, price: practitioner.price },
    { id: '6', time: '15:30 - 16:30', available: true, price: practitioner.price },
    { id: '7', time: '16:45 - 17:45', available: false, price: practitioner.price },
  ];

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
    setSelectedSlot(null); // Reset slot when date changes
  };

  const handleSlotSelect = (slot: TimeSlot) => {
    if (slot.available) {
      setSelectedSlot(slot);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDate || !selectedSlot) {
      alert('Please select a date and time slot');
      return;
    }
    console.log('Booking submitted:', {
      practitioner: practitioner.name,
      date: selectedDate.toISOString(),
      slot: selectedSlot.time,
      formData,
    });
    // TODO: Send to API
  };

  const isFormValid =
    selectedDate && selectedSlot && formData.firstName && formData.email && formData.agreeTerms;

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-white py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Breadcrumb */}
        <div className="mb-8 text-sm text-gray-600">
          <a href="/healers" className="text-indigo-600 hover:underline">
            All Healers
          </a>
          {' / '}
          <span className="text-gray-500">Booking</span>
        </div>

        {/* Main content */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left: Calendar & Availability */}
          <div className="lg:col-span-2 space-y-8">
            {/* Practitioner header */}
            <div className="bg-white p-6 rounded-2xl shadow-md">
              <div className="flex items-start space-x-4">
                <img
                  src={practitioner.image}
                  alt={practitioner.name}
                  className="w-24 h-24 object-contain rounded-lg"
                />
                <div className="flex-1">
                  <h1 className="text-3xl font-bold text-gray-800 mb-2">{practitioner.name}</h1>
                  <p className="text-indigo-600 font-semibold mb-1">{practitioner.specialty}</p>

                  {/* Rating */}
                  <div className="flex items-center space-x-2 mb-3">
                    <span className="text-yellow-400">★★★★★</span>
                    <span className="text-sm text-gray-600">
                      {practitioner.rating} ({practitioner.reviews} reviews)
                    </span>
                  </div>

                  <p className="text-gray-600 text-sm mb-2">{practitioner.bio}</p>
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <span>📍 {practitioner.location}</span>
                    <span>⏱ {practitioner.duration} mins</span>
                    <span className="font-semibold text-indigo-600">
                      R{practitioner.price.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Calendar */}
            <Calendar
              onDateSelect={handleDateSelect}
              selectedDate={selectedDate || undefined}
              minDate={new Date()}
              maxDate={new Date(Date.now() + 90 * 24 * 60 * 60 * 1000)} // 90 days ahead
            />

            {/* Time slots */}
            {selectedDate && (
              <div className="bg-white p-6 rounded-2xl shadow-md">
                <h3 className="text-xl font-bold text-gray-800 mb-4">
                  Available times on {selectedDate.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
                </h3>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {timeSlots.map((slot) => (
                    <button
                      key={slot.id}
                      onClick={() => handleSlotSelect(slot)}
                      disabled={!slot.available}
                      className={`
                        p-3 rounded-lg text-center font-medium transition
                        ${
                          selectedSlot?.id === slot.id
                            ? 'bg-indigo-600 text-white shadow-lg ring-2 ring-indigo-400'
                            : slot.available
                              ? 'bg-gray-100 text-gray-800 hover:bg-indigo-100 cursor-pointer'
                              : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                        }
                      `}
                    >
                      <div className="text-sm">{slot.time}</div>
                      {!slot.available && <div className="text-xs mt-1">Booked</div>}
                    </button>
                  ))}
                </div>

                {timeSlots.every((s) => !s.available) && (
                  <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg text-center text-sm text-yellow-800">
                    No available slots for this date. Please select another date.
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Right: Booking Form & Summary */}
          <div>
            <form onSubmit={handleSubmit} className="space-y-4 sticky top-6">
              {/* Booking Summary */}
              <div className="bg-white p-6 rounded-2xl shadow-md border-l-4 border-indigo-600">
                <h3 className="font-bold text-gray-800 mb-4 text-lg">Booking Summary</h3>

                {/* Date & Time */}
                <div className="space-y-3 pb-4 border-b">
                  <div>
                    <p className="text-xs text-gray-500 uppercase font-semibold">Date</p>
                    <p className="text-gray-800 font-semibold">
                      {selectedDate ? selectedDate.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' }) : 'Not selected'}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-gray-500 uppercase font-semibold">Time</p>
                    <p className="text-gray-800 font-semibold">
                      {selectedSlot ? selectedSlot.time : 'Not selected'}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-gray-500 uppercase font-semibold">Duration</p>
                    <p className="text-gray-800 font-semibold">{practitioner.duration} minutes</p>
                  </div>
                </div>

                {/* Pricing */}
                <div className="py-3 space-y-2 border-b">
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Service</span>
                    <span>R{practitioner.price.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Platform fee</span>
                    <span>R{Math.round(practitioner.price * 0.15).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between font-bold text-gray-800 pt-2">
                    <span>Total</span>
                    <span className="text-indigo-600 text-lg">
                      R{Math.round(practitioner.price * 1.15).toLocaleString()}
                    </span>
                  </div>
                </div>

                {/* Personal Info */}
                <div className="pt-4 space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      First Name *
                    </label>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      placeholder="John"
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Last Name *
                    </label>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      placeholder="Doe"
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="john@example.com"
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="+27 123 456 789"
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Notes (Optional)
                    </label>
                    <textarea
                      name="notes"
                      value={formData.notes}
                      onChange={handleInputChange}
                      placeholder="Tell the practitioner about your concerns or preferences..."
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>

                  <label className="flex items-start space-x-2 text-sm">
                    <input
                      type="checkbox"
                      name="agreeTerms"
                      checked={formData.agreeTerms}
                      onChange={handleInputChange}
                      required
                      className="mt-1 rounded"
                    />
                    <span className="text-gray-600">
                      I agree to the{' '}
                      <a href="#" className="text-indigo-600 hover:underline">
                        terms & conditions
                      </a>{' '}
                      and{' '}
                      <a href="#" className="text-indigo-600 hover:underline">
                        cancellation policy
                      </a>
                    </span>
                  </label>
                </div>

                {/* Buttons */}
                <button
                  type="submit"
                  disabled={!isFormValid}
                  className={`
                    w-full mt-4 py-3 rounded-lg font-bold text-white transition
                    ${
                      isFormValid
                        ? 'bg-indigo-600 hover:bg-indigo-700 cursor-pointer'
                        : 'bg-gray-300 cursor-not-allowed'
                    }
                  `}
                >
                  {isFormValid ? 'Proceed to Payment' : 'Select Date & Time'}
                </button>

                <button
                  type="button"
                  onClick={() => window.history.back()}
                  className="w-full mt-2 py-3 rounded-lg font-semibold text-gray-800 border border-gray-300 hover:bg-gray-50 transition"
                >
                  Back
                </button>
              </div>

              {/* Trust badges */}
              <div className="bg-white p-4 rounded-lg space-y-2 text-center text-xs text-gray-600">
                <p>✓ Secure booking</p>
                <p>✓ Instant confirmation</p>
                <p>✓ Free cancellation (24hrs)</p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
