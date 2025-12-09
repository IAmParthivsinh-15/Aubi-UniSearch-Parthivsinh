const mongoose = require('mongoose');

// University Schema
const universitySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    index: true,
  },
  domains: [String],
  web_pages: [String],
  country: {
    type: String,
    required: true,
    index: true,
  },
  alpha_two_code: String,
  'state-province': {
    type: String,
    index: true,
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('University', universitySchema);
