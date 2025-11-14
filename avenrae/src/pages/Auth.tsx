import { useState } from 'react';

type AuthTab = 'login' | 'signup';
type UserRole = 'client' | 'practitioner';

interface LoginFormData {
  email: string;
  password: string;
}

interface SignupFormData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  role: UserRole;
  phone: string;
  address: string;
  latitude: number | null;
  longitude: number | null;
  bio: string;
  specialization: string;
}

export default function Auth() {
  const [activeTab, setActiveTab] = useState<AuthTab>('login');
  const [loginData, setLoginData] = useState<LoginFormData>({
    email: '',
    password: '',
  });

  const [signupData, setSignupData] = useState<SignupFormData>({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'client',
    phone: '',
    address: '',
    latitude: null,
    longitude: null,
    bio: '',
    specialization: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Handle login input change
  const handleLoginChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLoginData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  // Handle signup input change
  const handleSignupChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setSignupData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  // Handle address search with Nominatim (OpenStreetMap)
  const handleAddressSearch = async (address: string) => {
    setSignupData((prev) => ({ ...prev, address }));

    if (address.length < 3) {
      setSearchResults([]);
      setShowSuggestions(false);
      return;
    }

    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}&limit=5`
      );
      const data = await response.json();
      setSearchResults(data);
      setShowSuggestions(true);
    } catch (error) {
      console.error('Error fetching address suggestions:', error);
    }
  };

  // Handle address selection from suggestions
  const handleSelectAddress = (result: any) => {
    setSignupData((prev) => ({
      ...prev,
      address: result.display_name,
      latitude: parseFloat(result.lat),
      longitude: parseFloat(result.lon),
    }));
    setShowSuggestions(false);
    setSearchResults([]);
  };

  // Validate login form
  const validateLogin = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!loginData.email) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(loginData.email)) {
      newErrors.email = 'Invalid email format';
    }

    if (!loginData.password) {
      newErrors.password = 'Password is required';
    } else if (loginData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Validate signup form
  const validateSignup = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!signupData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }

    if (!signupData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }

    if (!signupData.email) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(signupData.email)) {
      newErrors.email = 'Invalid email format';
    }

    if (!signupData.password) {
      newErrors.password = 'Password is required';
    } else if (signupData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }

    if (signupData.password !== signupData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (!signupData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    }

    if (signupData.role === 'practitioner') {
      if (!signupData.bio.trim()) {
        newErrors.bio = 'Bio is required for practitioners';
      }

      if (!signupData.specialization.trim()) {
        newErrors.specialization = 'Specialization is required';
      }

      if (!signupData.address.trim()) {
        newErrors.address = 'Address is required for practitioners';
      }

      if (!signupData.latitude || !signupData.longitude) {
        newErrors.address = 'Please select an address from suggestions';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle login submission
  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateLogin()) {
      console.log('Login submitted:', loginData);
      // TODO: Send to API
      alert('Login successful! (Mock)');
    }
  };

  // Handle signup submission
  const handleSignupSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateSignup()) {
      console.log('Signup submitted:', signupData);
      // TODO: Send to API
      alert('Account created successfully! (Mock)');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-50 py-8 px-4">
      <div className="max-w-md mx-auto">
        {/* Logo */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Avenrae</h1>
          <p className="text-gray-600">Connect with spiritual practitioners</p>
        </div>

        {/* Tab buttons */}
        <div className="flex gap-2 mb-8">
          <button
            onClick={() => {
              setActiveTab('login');
              setErrors({});
            }}
            className={`flex-1 py-3 font-bold rounded-lg transition ${
              activeTab === 'login'
                ? 'bg-indigo-600 text-white shadow-lg'
                : 'bg-white text-gray-600 border-2 border-gray-200 hover:border-indigo-300'
            }`}
          >
            Log In
          </button>
          <button
            onClick={() => {
              setActiveTab('signup');
              setErrors({});
            }}
            className={`flex-1 py-3 font-bold rounded-lg transition ${
              activeTab === 'signup'
                ? 'bg-indigo-600 text-white shadow-lg'
                : 'bg-white text-gray-600 border-2 border-gray-200 hover:border-indigo-300'
            }`}
          >
            Sign Up
          </button>
        </div>

        {/* Login Form */}
        {activeTab === 'login' && (
          <form onSubmit={handleLoginSubmit} className="bg-white p-8 rounded-2xl shadow-lg space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address</label>
              <input
                type="email"
                name="email"
                value={loginData.email}
                onChange={handleLoginChange}
                placeholder="you@example.com"
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition ${
                  errors.email ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Password</label>
              <input
                type="password"
                name="password"
                value={loginData.password}
                onChange={handleLoginChange}
                placeholder="••••••••"
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition ${
                  errors.password ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
            </div>

            <button
              type="submit"
              className="w-full bg-indigo-600 text-white py-3 rounded-lg font-bold hover:bg-indigo-700 transition shadow-lg hover:shadow-xl"
            >
              Log In
            </button>

            <p className="text-center text-sm text-gray-600 mt-4">
              Don't have an account?{' '}
              <button
                type="button"
                onClick={() => setActiveTab('signup')}
                className="text-indigo-600 font-semibold hover:underline"
              >
                Sign up
              </button>
            </p>
          </form>
        )}

        {/* Signup Form */}
        {activeTab === 'signup' && (
          <form onSubmit={handleSignupSubmit} className="bg-white p-8 rounded-2xl shadow-lg space-y-4 max-h-[80vh] overflow-y-auto">
            {/* Role Selection */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">I am a...</label>
              <select
                name="role"
                value={signupData.role}
                onChange={handleSignupChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="client">Client (Seeking Services)</option>
                <option value="practitioner">Practitioner (Healer/Prophet/Medium)</option>
              </select>
            </div>

            {/* First Name */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">First Name</label>
              <input
                type="text"
                name="firstName"
                value={signupData.firstName}
                onChange={handleSignupChange}
                placeholder="John"
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition ${
                  errors.firstName ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.firstName && <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>}
            </div>

            {/* Last Name */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Last Name</label>
              <input
                type="text"
                name="lastName"
                value={signupData.lastName}
                onChange={handleSignupChange}
                placeholder="Doe"
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition ${
                  errors.lastName ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.lastName && <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>}
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address</label>
              <input
                type="email"
                name="email"
                value={signupData.email}
                onChange={handleSignupChange}
                placeholder="you@example.com"
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition ${
                  errors.email ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Password</label>
              <input
                type="password"
                name="password"
                value={signupData.password}
                onChange={handleSignupChange}
                placeholder="••••••••"
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition ${
                  errors.password ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Confirm Password</label>
              <input
                type="password"
                name="confirmPassword"
                value={signupData.confirmPassword}
                onChange={handleSignupChange}
                placeholder="••••••••"
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition ${
                  errors.confirmPassword ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.confirmPassword && <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>}
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Phone Number</label>
              <input
                type="tel"
                name="phone"
                value={signupData.phone}
                onChange={handleSignupChange}
                placeholder="+27 123 456 789"
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition ${
                  errors.phone ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
            </div>

            {/* Practitioner-specific fields */}
            {signupData.role === 'practitioner' && (
              <>
                {/* Specialization */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Specialization *</label>
                  <select
                    name="specialization"
                    value={signupData.specialization}
                    onChange={handleSignupChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition ${
                      errors.specialization ? 'border-red-500' : 'border-gray-300'
                    }`}
                  >
                    <option value="">Select specialization</option>
                    <option value="healer">Healer</option>
                    <option value="prophet">Prophet</option>
                    <option value="medium">Medium</option>
                    <option value="counselor">Counselor</option>
                    <option value="other">Other</option>
                  </select>
                  {errors.specialization && <p className="text-red-500 text-sm mt-1">{errors.specialization}</p>}
                </div>

                {/* Bio */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Professional Bio *</label>
                  <textarea
                    name="bio"
                    value={signupData.bio}
                    onChange={handleSignupChange}
                    placeholder="Tell clients about your experience and services..."
                    rows={3}
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition ${
                      errors.bio ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {errors.bio && <p className="text-red-500 text-sm mt-1">{errors.bio}</p>}
                </div>

                {/* Address with search */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Service Address *</label>
                  <div className="relative">
                    <input
                      type="text"
                      name="address"
                      value={signupData.address}
                      onChange={(e) => handleAddressSearch(e.target.value)}
                      placeholder="Enter your service address..."
                      className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition ${
                        errors.address ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />

                    {/* Address suggestions dropdown */}
                    {showSuggestions && searchResults.length > 0 && (
                      <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg z-10 max-h-48 overflow-y-auto">
                        {searchResults.map((result, idx) => (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => handleSelectAddress(result)}
                            className="w-full text-left px-4 py-3 hover:bg-indigo-50 border-b last:border-b-0 transition"
                          >
                            <p className="text-sm text-gray-800 font-medium">{result.display_name}</p>
                            <p className="text-xs text-gray-500">
                              {result.address?.city || result.address?.town || ''} {result.address?.country || ''}
                            </p>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Show selected coordinates */}
                  {signupData.latitude && signupData.longitude && (
                    <p className="text-xs text-green-600 mt-1">
                      ✓ Location confirmed: ({signupData.latitude.toFixed(4)}, {signupData.longitude.toFixed(4)})
                    </p>
                  )}

                  {errors.address && <p className="text-red-500 text-sm mt-1">{errors.address}</p>}
                </div>
              </>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-indigo-600 text-white py-3 rounded-lg font-bold hover:bg-indigo-700 transition shadow-lg hover:shadow-xl mt-6"
            >
              Create Account
            </button>

            <p className="text-center text-sm text-gray-600 mt-4">
              Already have an account?{' '}
              <button
                type="button"
                onClick={() => setActiveTab('login')}
                className="text-indigo-600 font-semibold hover:underline"
              >
                Log in
              </button>
            </p>
          </form>
        )}
      </div>
    </div>
  );
}
