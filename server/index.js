// 4 steps procedure to make server

// Express ko bolana hoga iss file mein
const express = require("express");
const dotenv = require("dotenv");
//binding this env
dotenv.config();
// express ko call karna padega ek variable mein
const app = express()
// port define karna hoga - Port hota hai darwaza
const port = process.env.PORT || 5000;
//Making Routes
app.get("/", (req, res) => {
    res.send("<center><h1>Server is Runnning Dudes</h1></center>");
})
// Server ko listen karna hoga
app.listen(port, () => {
    console.log(`Server is running on ${port}`);
});

