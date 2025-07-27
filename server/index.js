// 4 steps procedure to make server

// Express ko bolana hoga iss file mein
const express = require("express");
const dotenv = require("dotenv");

//For mapping the routes
// const fs = require("fs");
// fs.readdirSync()

//Instead of using fs above way, we use it as in this way as we need somethings not like fully
const { readdirSync } = require("fs");  //Helps to read the folder structure
const { connectDB } = require("./connection");

// Import the Route here
// const authRoute = require("./routes/authRoutes");
//binding this env
dotenv.config();
// express ko call karna padega ek variable mein
const app = express()
// port define karna hoga - Port hota hai darwaza
const port = process.env.PORT || 5000;

//Connecting to the database
connectDB();
//Making Routes
app.get("/", (req, res) => {
    res.send("<center><h1>Server is Runnning Dudes</h1></center>");
});

//how to use routes
// app.use("/api", authRoute);

//Let's try to dynamically import and use the routes 
readdirSync("./routes").map((route) => 
    app.use("/api", require(`./routes/${route}`))   //If its a one liner code u dont need to use {} 
);
//console.log(readdirSync("./routes"));  //O/p -> Array mein aa rahi hai that is ['authRoutes.js']

//Types of requests
// 1. GET - to get the data from the server
// 2. POST - to post the data to the server
// 3. PUT - to update the data in the server
// 4. DELETE - to delete the data from the server

// Server ko listen karna hoga
app.listen(port, () => {
    console.log(`Server is running on ${port}`);
});

