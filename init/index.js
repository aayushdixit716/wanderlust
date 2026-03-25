const mongoose = require('mongoose');
const initData = require('./data.js');
const Listing = require('../models/listing.js');

async function main(){
    await mongoose.connect('mongodb://localhost:27017/wanderlust');
}
main().then(() => {
    console.log("Connected to MongoDB");
}).catch((err) => {
    console.error("Error connecting to MongoDB:", err);
});

const initDB = async () => {
    await Listing.deleteMany({});
    initData.data = initData.data.map((obj) => ({...obj, owner: "69b4e43d2220433ed0d62a3d",}));
    await Listing.insertMany(initData.data);
    console.log("Database initialized with sample data");
};

initDB();