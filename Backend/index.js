const express = require("express");
const app = express();
//const {clerkMiddleware} =  require("@clerk/express")
require("dotenv").config();
const path = require("path");
const MongoConnect = require("./src/lib/DB.js");
const userData = require("./src/routes/userData.routes.js");
const interviewRouter = require("./src/routes/interview.routes.js");

const PORT =  process.env.PORT;
//app.use(clerkMiddleware())
app.use(express.json())


app.use("/audio", express.static(path.join(__dirname, "public/audio")));

app.use("/", userData);
app.use("/",interviewRouter)



MongoConnect().then(()=>{
    console.log("DB Connected!!");

    app.listen(PORT , ()=>{
        console.log(`Server Started At : ${PORT}`);
    })
    
}).catch((error)=>{
    console.log(error); 
})
