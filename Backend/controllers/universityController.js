const University = require('../models/University');

// Get all unique countries
exports.getCountries = async (req, res) => {
  try {
    const countries = await University.distinct('country');
    const sortedCountries = countries.sort();
    res.json(sortedCountries);
  } catch (error) {
    console.error('Error fetching countries:', error);
    res.status(500).json({ error: 'Failed to fetch countries' });
  }
};

// Get unique provinces for a specific country
exports.getProvinces = async (req, res) => {
  try {
    const { country } = req.params;
    const provinces = await University.distinct('state-province', {
      country: decodeURIComponent(country),
      'state-province': { $ne: null },
    });
    
    const sortedProvinces = provinces.filter(p => p !== null).sort();
    res.json(sortedProvinces);
  } catch (error) {
    console.error('Error fetching provinces:', error);
    res.status(500).json({ error: 'Failed to fetch provinces' });
  }
};

// Get universities with filters
exports.getUniversities = async (req, res) => {
  try {
    const { country, province } = req.query;
    let query = {};

    if (country) {
      query.country = decodeURIComponent(country);
    }

    if (province) {
      query['state-province'] = decodeURIComponent(province);
    }

    const universities = await University.find(query).limit(100);
    res.json(universities);
  } catch (error) {
    console.error('Error fetching universities:', error);
    res.status(500).json({ error: 'Failed to fetch universities' });
  }
};

// Get single university by name
exports.getUniversityByName = async (req, res) => {
  try {
    const { name } = req.params;
    const university = await University.findOne({
      name: decodeURIComponent(name),
    });

    if (university) {
      res.json(university);
    } else {
      res.status(404).json({ error: 'University not found' });
    }
  } catch (error) {
    console.error('Error fetching university:', error);
    res.status(500).json({ error: 'Failed to fetch university' });
  }
};

// Search universities by name (partial match)
exports.searchUniversities = async (req, res) => {
  try {
    const { q } = req.query;
    
    if (!q) {
      return res.status(400).json({ error: 'Search query required' });
    }

    const universities = await University.find({
      name: { $regex: decodeURIComponent(q), $options: 'i' }
    }).limit(50);

    res.json(universities);
  } catch (error) {
    console.error('Error searching universities:', error);
    res.status(500).json({ error: 'Failed to search universities' });
  }
};

// Analytics: Get overall statistics
exports.getAnalyticsStats = async (req, res) => {
  try {
    const totalUniversities = await University.countDocuments();
    const totalCountries = await University.distinct('country').then(c => c.length);
    const totalProvinces = await University.distinct('state-province').then(p => p.filter(x => x !== null && x !== '').length);

    res.json({
      totalUniversities,
      totalCountries,
      totalProvinces
    });
  } catch (error) {
    console.error('Error fetching analytics stats:', error);
    res.status(500).json({ error: 'Failed to fetch analytics stats' });
  }
};

// Analytics: Get universities count by country
exports.getUniversitiesByCountry = async (req, res) => {
  try {
    const data = await University.aggregate([
      {
        $group: {
          _id: '$country',
          count: { $sum: 1 }
        }
      },
      {
        $sort: { count: -1 }
      }
    ]);

    res.json(data);
  } catch (error) {
    console.error('Error fetching universities by country:', error);
    res.status(500).json({ error: 'Failed to fetch universities by country' });
  }
};

// Analytics: Get website statistics
exports.getWebsiteStats = async (req, res) => {
  try {
    const total = await University.countDocuments();
    const withWebsite = await University.countDocuments({
      web_pages: { $exists: true, $ne: [] }
    });
    const withoutWebsite = total - withWebsite;

    res.json({
      withWebsite,
      withoutWebsite,
      percentage: Math.round((withWebsite / total) * 100)
    });
  } catch (error) {
    console.error('Error fetching website stats:', error);
    res.status(500).json({ error: 'Failed to fetch website stats' });
  }
};

// Analytics: Get provinces for a country
exports.getCountryProvinces = async (req, res) => {
  try {
    const { country } = req.params;
    const decodedCountry = decodeURIComponent(country);

    const provinces = await University.aggregate([
      {
        $match: { country: decodedCountry }
      },
      {
        $group: {
          _id: '$state-province',
          count: { $sum: 1 }
        }
      },
      {
        $match: { _id: { $ne: null } }
      },
      {
        $sort: { count: -1 }
      }
    ]);

    const universities = await University.find({ country: decodedCountry }).limit(100);

    res.json({
      country: decodedCountry,
      provinces,
      universities,
      totalInCountry: await University.countDocuments({ country: decodedCountry })
    });
  } catch (error) {
    console.error('Error fetching country provinces:', error);
    res.status(500).json({ error: 'Failed to fetch country data' });
  }
};
