import React, { useState, useEffect } from 'react';
import html2canvas from 'html2canvas';

const API_BASE_URL = 'http://localhost:5001/api';

export default function UniversitySearch() {
  const [countries, setCountries] = useState([]);
  const [provinces, setProvinces] = useState([]);
  const [universities, setUniversities] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState('');
  const [selectedProvince, setSelectedProvince] = useState('');
  const [countryInput, setCountryInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Fetch all countries on component mount
  useEffect(() => {
    fetchCountries();
  }, []);

  const fetchCountries = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/countries`);
      if (!response.ok) throw new Error('Failed to fetch countries');
      const data = await response.json();
      setCountries(data);
      setError('');
    } catch (err) {
      setError('Failed to load countries');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Handle country selection
  const handleCountrySelect = async (country) => {
    setSelectedCountry(country);
    setCountryInput(country);
    setSelectedProvince('');
    setProvinces([]);
    
    try {
      setLoading(true);
      // Fetch provinces for selected country
      const provincesResponse = await fetch(
        `${API_BASE_URL}/provinces/${encodeURIComponent(country)}`
      );
      if (provincesResponse.ok) {
        const provincesData = await provincesResponse.json();
        setProvinces(provincesData);
      }

      // Fetch universities for selected country
      const universitiesResponse = await fetch(
        `${API_BASE_URL}/universities?country=${encodeURIComponent(country)}`
      );
      if (universitiesResponse.ok) {
        const universitiesData = await universitiesResponse.json();
        setUniversities(universitiesData);
      }
      setError('');
    } catch (err) {
      setError('Failed to load data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Handle province selection
  const handleProvinceSelect = async (province) => {
    setSelectedProvince(province);
    
    try {
      setLoading(true);
      const response = await fetch(
        `${API_BASE_URL}/universities?country=${encodeURIComponent(selectedCountry)}&province=${encodeURIComponent(province)}`
      );
      if (response.ok) {
        const data = await response.json();
        setUniversities(data);
      }
      setError('');
    } catch (err) {
      setError('Failed to load universities');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Download university card as JPEG
  const downloadUniversityCard = async (university) => {
    try {
      const cardElement = document.getElementById(`uni-card-${university.name}`);
      if (!cardElement) return;

      const canvas = await html2canvas(cardElement, {
        backgroundColor: '#ffffff',
        scale: 2,
      });

      const link = document.createElement('a');
      link.href = canvas.toDataURL('image/jpeg', 0.95);
      link.download = `${university.name.replace(/[^a-z0-9]/gi, '_')}.jpeg`;
      link.click();
    } catch (err) {
      console.error('Failed to download card:', err);
      setError('Failed to download card');
    }
  };

  return (
    <div className="w-full h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex flex-col overflow-hidden">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 px-12 py-8 shadow-2xl border-b-4 border-blue-400">
        <h1 className="text-5xl font-bold text-white mb-2 tracking-tight">
          🔍 University Search
        </h1>
        <p className="text-blue-100 text-lg font-light">
          Search and explore universities worldwide with advanced filtering
        </p>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <div className="px-12 py-10">
          {/* Search Section */}
          <div className="bg-white rounded-xl shadow-2xl p-8 mb-10">
            <div className="grid grid-cols-2 gap-8 items-start">
              {/* Left Column - Inputs */}
              <div className="space-y-6">
                {/* Country Input */}
                <div>
                  <label className="block text-lg font-semibold text-gray-800 mb-3">
                    Select Country
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Type country name..."
                      value={countryInput}
                      onChange={(e) => setCountryInput(e.target.value)}
                      className="w-full px-5 py-3 text-base border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-200 transition-all shadow-sm"
                    />
                    {countryInput && countries.length > 0 && (
                      <div className="absolute z-20 w-full mt-2 bg-white border-2 border-gray-300 rounded-lg shadow-xl max-h-72 overflow-y-auto">
                        {countries
                          .filter((c) =>
                            c.toLowerCase().includes(countryInput.toLowerCase())
                          )
                          .map((country) => (
                            <button
                              key={country}
                              onClick={() => handleCountrySelect(country)}
                              className="w-full text-left px-5 py-3 hover:bg-blue-50 border-b border-gray-100 text-gray-900 font-medium transition-colors text-base"
                            >
                              {country}
                            </button>
                          ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Province Dropdown */}
                {provinces.length > 0 && (
                  <div>
                    <label className="block text-lg font-semibold text-gray-800 mb-3">
                      Select State/Province
                    </label>
                    <select
                      value={selectedProvince}
                      onChange={(e) => handleProvinceSelect(e.target.value)}
                      className="w-full px-5 py-3 text-base border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-200 transition-all bg-white text-gray-900 font-medium shadow-sm"
                    >
                      <option value="" className="text-gray-900">All Provinces</option>
                      {provinces.map((province) => (
                        <option key={province} value={province} className="text-gray-900">
                          {province}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </div>

              {/* Right Column - Stats */}
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-8 border-2 border-blue-200">
                {selectedCountry && (
                  <div className="space-y-4">
                    <div className="border-b-2 border-blue-200 pb-4">
                      <p className="text-sm text-gray-600 font-semibold uppercase tracking-wide">Current Selection</p>
                      <p className="text-2xl font-bold text-blue-700 mt-2">{selectedCountry}</p>
                    </div>
                    {selectedProvince && (
                      <div className="border-b-2 border-indigo-200 pb-4">
                        <p className="text-sm text-gray-600 font-semibold uppercase tracking-wide">Province/State</p>
                        <p className="text-2xl font-bold text-indigo-700 mt-2">{selectedProvince}</p>
                      </div>
                    )}
                    <div className="pt-2">
                      <p className="text-sm text-gray-600 font-semibold uppercase tracking-wide">Results Found</p>
                      <p className="text-3xl font-bold text-green-600 mt-2">{universities.length}</p>
                    </div>
                  </div>
                )}
                {!selectedCountry && (
                  <div className="text-center py-8">
                    <p className="text-gray-500 text-lg">👇 Select a country to begin</p>
                  </div>
                )}
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border-l-4 border-red-500 p-4 mt-6 rounded-lg">
                <p className="text-red-700 font-semibold">⚠️ {error}</p>
              </div>
            )}

            {/* Loading State */}
            {loading && (
              <div className="text-center py-8 mt-6">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-200 border-t-blue-600"></div>
                <p className="text-gray-600 mt-3 font-semibold">Loading universities...</p>
              </div>
            )}
          </div>

          {/* Universities Grid */}
          {!loading && universities.length > 0 && (
            <div>
              <h2 className="text-3xl font-bold text-white mb-6 flex items-center">
                📚 Results
                <span className="ml-3 bg-blue-600 px-4 py-1 rounded-full text-lg">
                  {universities.length}
                </span>
              </h2>
              <div className="grid grid-cols-4 gap-6">
                {universities.map((university) => (
                  <div
                    key={university.name}
                    id={`uni-card-${university.name}`}
                    className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden hover:scale-105 transform"
                  >
                    <div className="bg-gradient-to-r from-blue-500 to-indigo-600 h-3"></div>
                    
                    <div className="p-5">
                      {/* University Name */}
                      <h3 className="text-lg font-bold text-gray-900 mb-3 line-clamp-2 h-14 leading-tight">
                        {university.name}
                      </h3>

                      {/* Country and Province */}
                      <div className="mb-4 space-y-2 pb-4 border-b-2 border-gray-200">
                        <p className="text-sm text-gray-700">
                          <span className="font-bold text-blue-600">Country:</span> {university.country}
                        </p>
                        {university['state-province'] && (
                          <p className="text-sm text-gray-700">
                            <span className="font-bold text-indigo-600">Province:</span> {university['state-province']}
                          </p>
                        )}
                      </div>

                      {/* Website Link */}
                      {university.web_pages && university.web_pages.length > 0 && (
                        <div className="mb-4 pb-4 border-b-2 border-gray-200">
                          <p className="text-xs font-bold text-gray-600 mb-2 uppercase tracking-wide">🌐 Website</p>
                          <a
                            href={university.web_pages[0]}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-800 font-semibold break-all text-xs hover:underline transition-colors block truncate"
                            title={university.web_pages[0]}
                          >
                            {university.web_pages[0]}
                          </a>
                        </div>
                      )}

                      {/* Domains */}
                      {university.domains && university.domains.length > 0 && (
                        <div className="mb-4">
                          <p className="text-xs font-bold text-gray-600 mb-2 uppercase tracking-wide">📧 Domains</p>
                          <p className="text-xs text-gray-600 bg-gray-100 px-2 py-1 rounded truncate">
                            {university.domains[0]}
                          </p>
                        </div>
                      )}

                      {/* Download Button */}
                      <button
                        onClick={() => downloadUniversityCard(university)}
                        className="w-full mt-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold py-2 px-3 rounded-lg transition-all duration-200 transform hover:scale-105 text-sm"
                      >
                        ⬇ Download JPEG
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* No Results Message */}
          {!loading && selectedCountry && universities.length === 0 && (
            <div className="text-center py-16 bg-white rounded-xl shadow-lg">
              <p className="text-xl text-gray-600 font-semibold">
                No universities found{selectedProvince ? ` in ${selectedProvince}` : ''}.
              </p>
            </div>
          )}

          {/* Initial State */}
          {!selectedCountry && universities.length === 0 && !loading && (
            <div className="text-center py-16 bg-white rounded-xl shadow-lg">
              <p className="text-2xl text-gray-600 font-semibold">
                👋 Start your search by selecting a country
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
