const mongoose = require("mongoose");
require("dotenv").config();

const MongoConnect =async ()=>{
   try {
    await mongoose.connect(process.env.MONGO_URL);    
   } catch (error) {
    console.log(error);
    
   }
}
module.exports = MongoConnect