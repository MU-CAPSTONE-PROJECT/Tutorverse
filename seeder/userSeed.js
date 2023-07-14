const fs = require('fs');
const path = require ('path');
const { fileURLToPath } = require('url');


__filename = fileURLToPath(require('url').pathToFileURL(__filename).href);
 __dirname = path.dirname(__filename);

const userData = JSON.parse(fs.readFileSync(path.resolve(__dirname, '/Users/tanyachisepo/Code/Tutorverse/seeder/usersMockData.json'), 'utf8'));


const { sequelize, User } = require('../tutorverse-server/data');

const seedDatabase = async () => {
  try {
    await sequelize.sync({ alter: true });
    console.log('Database synchronized');

    // Insert sample data into the database
    await User.bulkCreate(userData);
    console.log('Sample data inserted');

    process.exit(0);
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
};

seedDatabase();
