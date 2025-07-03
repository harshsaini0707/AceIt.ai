const express = require("express");
const app = express();
//const {clerkMiddleware} =  require("@clerk/express")
require("dotenv").config();
const MongoConnect = require("./src/lib/DB.js");
const userData = require("./src/routes/userData.routes.js");

const PORT =  process.env.PORT;
//app.use(clerkMiddleware())
app.use(express.json())



app.use("/", userData);


MongoConnect().then(()=>{
    console.log("DB Connected!!");

    app.listen(PORT , ()=>{
        console.log(`Server Started At : ${PORT}`);
    })
    
}).catch((error)=>{
    console.log(error); 
})
