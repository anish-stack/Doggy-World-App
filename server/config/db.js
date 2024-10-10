const mongoose = require('mongoose');

const connectDb = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URL);
    console.log('Database is Connected Successfully');
  } catch (error) {
    console.error('Failed to Connect to Database', error);
    // You can choose to exit the process if the database connection fails
    process.exit(1);
  }
};

module.exports = connectDb;