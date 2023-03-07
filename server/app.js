const express = require("express");
const app = express();

app.get('/getData', (req, res) => {
    res.json({
        "status code" : 200,
        "status Message" : "SUCCESS"
    })
})

app.listen(3000, (req, res) => {
    console.log("Express API is running on Port 3000!");
})