const mongoose = require('mongoose');

const connectDB = async (req, res) => {
    const connection = await mongoose.connect(process.env.MONGO_URI)
    if(connection.STATES.connected) return console.log("Database connected");
    if(connection.STATES.disconnected) return console.log("Database disconnected");
};

module.exports = { connectDB };