console.log("File started");

const express = require('express');
const app = express();

app.get("/", (req, res) => {
    console.log("Route hit");
    res.send("HELLO");
});

app.listen(3000, () => {
    console.log("Server running on port 3000");
});