const express = require("express");
const app = express()
const dotenv = require('dotenv');
// get config vars
dotenv.config();

app.use(express.json())

app.use('/api/user', require("./routes/user"))
app.use('/api/comment', require("./routes/comment"))

app.listen(5000,() => {
    console.log("Listening on port 5000!!")
})
