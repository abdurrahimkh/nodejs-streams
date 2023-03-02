const mongoose = require('mongoose');
mongoose.set('strictQuery', false);
const connectDB = async () => {
  try {
    const res = await mongoose.connect(process.env.MONGO_URI);
    if (res) {
      console.log('DB CONNECTED');
    }
  } catch (error) {
    console.log(error.message);
  }
};

module.exports = { connectDB };
