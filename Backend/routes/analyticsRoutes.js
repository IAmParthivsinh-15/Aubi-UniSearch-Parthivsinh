const express = require('express');
const router = express.Router();
const analyticsController = require('../controllers/analyticsController');

// Analytics Routes
router.get('/stats', analyticsController.getStats);
router.get('/universities-by-country', analyticsController.getUniversitiesByCountry);
router.get('/top-countries', analyticsController.getTopCountries);
router.get('/country/:country', analyticsController.getCountryDetails);
router.get('/region-distribution', analyticsController.getRegionDistribution);
router.get('/website-stats', analyticsController.getWebsiteStats);
router.get('/provinces/:country', analyticsController.getProvinceStats);

module.exports = router;
