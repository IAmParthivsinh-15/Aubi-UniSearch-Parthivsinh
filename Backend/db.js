const fs = require('fs');
const path = require('path');
const University = require('./models/University');

// Function to import data from JSON (run once)
const importDataFromJSON = async () => {
  try {
    const count = await University.countDocuments();
    if (count > 0) {
      console.log(`✓ Database already has ${count} universities`);
      return;
    }

    const dataPath = path.join(__dirname, 'data', 'data.json');
    const rawData = fs.readFileSync(dataPath, 'utf-8');
    const universitiesData = JSON.parse(rawData);

    console.log(`📥 Importing ${universitiesData.length} universities from JSON...`);
    await University.insertMany(universitiesData, { ordered: false });
    console.log(`✓ Successfully imported ${universitiesData.length} universities to MongoDB`);
  } catch (error) {
    if (error.code === 11000) {
      console.log('✓ Data already exists in database');
    } else if (error.name === 'MongoBulkWriteError') {
      // This error occurs when some documents already exist
      console.log(`✓ Bulk import completed (some documents may already exist)`);
    } else {
      console.error('Error importing data:', error.message);
    }
  }
};

module.exports = {
  importDataFromJSON,
};
