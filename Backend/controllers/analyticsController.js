const University = require('../models/University');

// Get statistics overview
exports.getStats = async (req, res) => {
  try {
    const totalUniversities = await University.countDocuments();
    const totalCountries = await University.distinct('country');
    const totalProvinces = await University.distinct('state-province');
    
    res.json({
      totalUniversities,
      totalCountries: totalCountries.length,
      totalProvinces: totalProvinces.filter(p => p !== null).length,
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).json({ error: 'Failed to fetch statistics' });
  }
};

// Get universities count by country
exports.getUniversitiesByCountry = async (req, res) => {
  try {
    const data = await University.aggregate([
      {
        $group: {
          _id: '$country',
          count: { $sum: 1 },
        },
      },
      {
        $sort: { count: -1 },
      },
      {
        $limit: 30,
      },
    ]);

    res.json(data);
  } catch (error) {
    console.error('Error fetching universities by country:', error);
    res.status(500).json({ error: 'Failed to fetch data' });
  }
};

// Get universities and provinces for a specific country
exports.getCountryDetails = async (req, res) => {
  try {
    const { country } = req.params;

    const countryData = await University.aggregate([
      {
        $match: { country: decodeURIComponent(country) },
      },
      {
        $group: {
          _id: '$state-province',
          count: { $sum: 1 },
        },
      },
      {
        $sort: { count: -1 },
      },
    ]);

    const totalInCountry = await University.countDocuments({
      country: decodeURIComponent(country),
    });

    res.json({
      country: decodeURIComponent(country),
      total: totalInCountry,
      provinces: countryData,
    });
  } catch (error) {
    console.error('Error fetching country details:', error);
    res.status(500).json({ error: 'Failed to fetch country details' });
  }
};

// Get top countries by universities count
exports.getTopCountries = async (req, res) => {
  try {
    const limit = req.query.limit || 15;
    const data = await University.aggregate([
      {
        $group: {
          _id: '$country',
          count: { $sum: 1 },
        },
      },
      {
        $sort: { count: -1 },
      },
      {
        $limit: parseInt(limit),
      },
    ]);

    res.json(data);
  } catch (error) {
    console.error('Error fetching top countries:', error);
    res.status(500).json({ error: 'Failed to fetch top countries' });
  }
};

// Get distribution by regions (based on unique countries)
exports.getRegionDistribution = async (req, res) => {
  try {
    const data = await University.aggregate([
      {
        $group: {
          _id: '$country',
          count: { $sum: 1 },
        },
      },
      {
        $facet: {
          byCount: [
            { $group: { _id: null, ranges: { $push: '$$ROOT' } } },
          ],
          stats: [
            {
              $group: {
                _id: null,
                totalCountries: { $sum: 1 },
                avgPerCountry: { $avg: '$count' },
                maxCount: { $max: '$count' },
                minCount: { $min: '$count' },
              },
            },
          ],
        },
      },
    ]);

    res.json(data);
  } catch (error) {
    console.error('Error fetching region distribution:', error);
    res.status(500).json({ error: 'Failed to fetch distribution' });
  }
};

// Get universities with websites vs without
exports.getWebsiteStats = async (req, res) => {
  try {
    const withWebsite = await University.countDocuments({
      web_pages: { $exists: true, $ne: [] },
    });

    const withoutWebsite = await University.countDocuments({
      $or: [
        { web_pages: { $exists: false } },
        { web_pages: [] },
      ],
    });

    res.json({
      withWebsite,
      withoutWebsite,
      total: withWebsite + withoutWebsite,
      percentageWithWebsite: ((withWebsite / (withWebsite + withoutWebsite)) * 100).toFixed(2),
    });
  } catch (error) {
    console.error('Error fetching website stats:', error);
    res.status(500).json({ error: 'Failed to fetch website stats' });
  }
};

// Get provinces count in selected country
exports.getProvinceStats = async (req, res) => {
  try {
    const { country } = req.params;

    const provinceData = await University.aggregate([
      {
        $match: { country: decodeURIComponent(country) },
      },
      {
        $group: {
          _id: '$state-province',
          count: { $sum: 1 },
        },
      },
      {
        $match: { _id: { $ne: null } },
      },
      {
        $sort: { count: -1 },
      },
    ]);

    const withoutProvince = await University.countDocuments({
      country: decodeURIComponent(country),
      'state-province': null,
    });

    res.json({
      provinces: provinceData,
      withoutProvince,
    });
  } catch (error) {
    console.error('Error fetching province stats:', error);
    res.status(500).json({ error: 'Failed to fetch province stats' });
  }
};
