import React, { useState, useEffect } from 'react';
import {
  BarChart, Bar, PieChart, Pie, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell
} from 'recharts';

const API_BASE_URL = 'http://localhost:5001/api/analytics';

const COLORS = ['#3b82f6', '#1d4ed8', '#1e40af', '#1e3a8a', '#0c2240'];

export default function Analytics() {
  const [stats, setStats] = useState(null);
  const [countriesData, setCountriesData] = useState([]);
  const [topCountries, setTopCountries] = useState([]);
  const [websiteStats, setWebsiteStats] = useState(null);
  const [selectedCountry, setSelectedCountry] = useState('');
  const [countryDetails, setCountryDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [countries, setCountries] = useState([]);

  // Fetch initial data
  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    try {
      setLoading(true);
      
      // Fetch stats
      const statsRes = await fetch(`${API_BASE_URL}/stats`);
      const statsData = await statsRes.json();
      setStats(statsData);

      // Fetch top countries
      const countriesRes = await fetch(`${API_BASE_URL}/universities-by-country`);
      const countriesData = await countriesRes.json();
      setCountriesData(countriesData.slice(0, 15));
      setTopCountries(countriesData);
      setCountries(countriesData.map(c => c._id));

      // Fetch website stats
      const websiteRes = await fetch(`${API_BASE_URL}/website-stats`);
      const websiteData = await websiteRes.json();
      setWebsiteStats(websiteData);

      setError('');
    } catch (err) {
      console.error('Error fetching analytics:', err);
      setError('Failed to load analytics data');
    } finally {
      setLoading(false);
    }
  };

  const handleCountrySelect = async (country) => {
    setSelectedCountry(country);
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE_URL}/provinces/${encodeURIComponent(country)}`);
      const data = await res.json();
      setCountryDetails(data);
      setError('');
    } catch (err) {
      console.error('Error fetching country details:', err);
      setError('Failed to load country details');
    } finally {
      setLoading(false);
    }
  };

  if (loading && !stats) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-200 border-t-blue-600 mx-auto mb-4"></div>
          <p className="text-white text-lg font-semibold">Loading analytics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 p-0">
      <div className="max-w-full mx-auto h-screen flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 px-12 py-8 shadow-2xl border-b-4 border-blue-400">
          <h1 className="text-5xl font-bold text-white mb-2 tracking-tight">
            📊 Analytics Dashboard
          </h1>
          <p className="text-blue-100 text-lg font-light">
            Comprehensive statistics and insights from university data
          </p>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto">
          <div className="px-12 py-10 space-y-10">
            {/* Stats Overview */}
            {stats && (
              <div className="grid grid-cols-3 gap-6">
                <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl p-8 text-white shadow-xl">
                  <p className="text-blue-100 text-sm font-semibold uppercase tracking-wide mb-2">Total Universities</p>
                  <p className="text-5xl font-bold">{stats.totalUniversities}</p>
                </div>
                <div className="bg-gradient-to-br from-indigo-600 to-indigo-700 rounded-xl p-8 text-white shadow-xl">
                  <p className="text-indigo-100 text-sm font-semibold uppercase tracking-wide mb-2">Countries</p>
                  <p className="text-5xl font-bold">{stats.totalCountries}</p>
                </div>
                <div className="bg-gradient-to-br from-purple-600 to-purple-700 rounded-xl p-8 text-white shadow-xl">
                  <p className="text-purple-100 text-sm font-semibold uppercase tracking-wide mb-2">Provinces/States</p>
                  <p className="text-5xl font-bold">{stats.totalProvinces}</p>
                </div>
              </div>
            )}

            {error && (
              <div className="bg-red-900 border-l-4 border-red-500 p-4 rounded text-red-200">
                {error}
              </div>
            )}

            {/* Charts Row 1 */}
            <div className="grid grid-cols-2 gap-8">
              {/* Universities by Country */}
              <div className="bg-white rounded-xl shadow-2xl p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Top 15 Countries</h2>
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart data={countriesData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="_id" angle={-45} textAnchor="end" height={80} tick={{ fontSize: 12 }} />
                    <YAxis />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#1f2937', border: 'none', borderRadius: '8px', color: '#fff' }}
                      cursor={{ fill: 'rgba(59, 130, 246, 0.1)' }}
                    />
                    <Bar dataKey="count" fill="#3b82f6" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Website Statistics */}
              {websiteStats && (
                <div className="bg-white rounded-xl shadow-2xl p-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Website Availability</h2>
                  <ResponsiveContainer width="100%" height={400}>
                    <PieChart>
                      <Pie
                        data={[
                          { name: 'With Website', value: websiteStats.withWebsite },
                          { name: 'Without Website', value: websiteStats.withoutWebsite }
                        ]}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, value, percent }) => `${name}: ${value} (${(percent * 100).toFixed(1)}%)`}
                        outerRadius={120}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        <Cell fill="#3b82f6" />
                        <Cell fill="#10b981" />
                      </Pie>
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#1f2937', border: 'none', borderRadius: '8px', color: '#fff' }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="mt-6 text-center">
                    <p className="text-gray-600 font-semibold">
                      {websiteStats.percentage || 0}% have active websites
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Country Details Section */}
            <div className="bg-white rounded-xl shadow-2xl p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Detailed Country Analytics</h2>
              
              <div className="mb-8">
                <label className="block text-lg font-semibold text-gray-800 mb-3">Select Country</label>
                <select
                  value={selectedCountry}
                  onChange={(e) => handleCountrySelect(e.target.value)}
                  className="w-full max-w-md px-5 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-200 bg-white text-gray-900 font-medium"
                >
                  <option value="">Select a country...</option>
                  {countries.map((country) => (
                    <option key={country} value={country}>
                      {country}
                    </option>
                  ))}
                </select>
              </div>

              {selectedCountry && countryDetails && (
                <div className="space-y-8">
                  {/* Country Stats */}
                  <div className="grid grid-cols-2 gap-6">
                    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-6 border-2 border-blue-200">
                      <p className="text-gray-600 font-semibold uppercase tracking-wide mb-2">Total Universities</p>
                      <p className="text-4xl font-bold text-blue-600">{countryDetails.totalInCountry || 0}</p>
                    </div>
                    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-6 border-2 border-blue-200">
                      <p className="text-gray-600 font-semibold uppercase tracking-wide mb-2">Provinces with Data</p>
                      <p className="text-4xl font-bold text-blue-600">{countryDetails.provinces?.length || 0}</p>
                    </div>
                  </div>

                  {/* Provinces Chart */}
                  {countryDetails.provinces && countryDetails.provinces.length > 0 && (
                    <div className="bg-gray-50 rounded-lg p-6">
                      <h3 className="text-xl font-bold text-gray-900 mb-4">Universities by Province/State</h3>
                      <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={countryDetails.provinces}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                          <XAxis 
                            dataKey="_id" 
                            angle={-45} 
                            textAnchor="end" 
                            height={80}
                            tick={{ fontSize: 11 }}
                          />
                          <YAxis />
                          <Tooltip 
                            contentStyle={{ backgroundColor: '#1f2937', border: 'none', borderRadius: '8px', color: '#fff' }}
                          />
                          <Bar dataKey="count" fill="#0ea5e9" radius={[8, 8, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  )}

                  {/* Universities List */}
                  {countryDetails.universities && countryDetails.universities.length > 0 && (
                    <div className="bg-gray-50 rounded-lg p-6">
                      <h3 className="text-xl font-bold text-gray-900 mb-4">Universities in {selectedCountry}</h3>
                      <div className="overflow-x-auto">
                        <table className="w-full text-sm text-gray-700">
                          <thead className="bg-blue-100 text-gray-900 font-semibold">
                            <tr>
                              <th className="px-4 py-2 text-left">University Name</th>
                              <th className="px-4 py-2 text-left">Province/State</th>
                              <th className="px-4 py-2 text-left">Website</th>
                            </tr>
                          </thead>
                          <tbody>
                            {countryDetails.universities.slice(0, 10).map((uni, idx) => (
                              <tr key={idx} className="border-b hover:bg-blue-50">
                                <td className="px-4 py-2">{uni.name}</td>
                                <td className="px-4 py-2">{uni['state-province'] || 'N/A'}</td>
                                <td className="px-4 py-2">
                                  {uni.web_pages && uni.web_pages.length > 0 ? (
                                    <a href={uni.web_pages[0]} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline truncate">
                                      Visit
                                    </a>
                                  ) : (
                                    'N/A'
                                  )}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                        {countryDetails.universities.length > 10 && (
                          <p className="text-center text-gray-600 mt-4 font-semibold">
                            ... and {countryDetails.universities.length - 10} more universities
                          </p>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {selectedCountry && loading && (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-200 border-t-blue-600 mx-auto mb-3"></div>
                  <p className="text-gray-600 font-semibold">Loading country details...</p>
                </div>
              )}
            </div>

            {/* Additional Insights */}
            <div className="bg-white rounded-xl shadow-2xl p-8 mb-10">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Key Insights</h2>
              <div className="grid grid-cols-3 gap-6">
                <div className="bg-blue-50 rounded-lg p-6 border-l-4 border-blue-600">
                  <p className="text-gray-600 text-sm uppercase font-semibold tracking-wide mb-2">Average Universities per Country</p>
                  <p className="text-3xl font-bold text-blue-600">
                    {stats ? (stats.totalUniversities / stats.totalCountries).toFixed(1) : 0}
                  </p>
                </div>
                <div className="bg-indigo-50 rounded-lg p-6 border-l-4 border-indigo-600">
                  <p className="text-gray-600 text-sm uppercase font-semibold tracking-wide mb-2">Average Provinces per Country</p>
                  <p className="text-3xl font-bold text-indigo-600">
                    {stats ? (stats.totalProvinces / stats.totalCountries).toFixed(1) : 0}
                  </p>
                </div>
                <div className="bg-purple-50 rounded-lg p-6 border-l-4 border-purple-600">
                  <p className="text-gray-600 text-sm uppercase font-semibold tracking-wide mb-2">Data Coverage</p>
                  <p className="text-3xl font-bold text-purple-600">
                    {websiteStats ? websiteStats.percentage : 0}%
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
