const express = require('express');
const router = express.Router();
const universityController = require('../controllers/universityController');

// Routes
router.get('/countries', universityController.getCountries);
router.get('/provinces/:country', universityController.getProvinces);
router.get('/universities', universityController.getUniversities);
router.get('/university/:name', universityController.getUniversityByName);
router.get('/search', universityController.searchUniversities);

// Analytics routes
router.get('/analytics/stats', universityController.getAnalyticsStats);
router.get('/analytics/universities-by-country', universityController.getUniversitiesByCountry);
router.get('/analytics/website-stats', universityController.getWebsiteStats);
router.get('/analytics/provinces/:country', universityController.getCountryProvinces);

module.exports = router;
