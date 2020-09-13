const express = require("express"),
    bodyParser = require("body-parser"),
    mongoose = require("mongoose"),
    app = express();

mongoose.connect("mongodb://localhost:27017/BlogSite", { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => { console.log("Connected to DB!") })
    .catch((err) => { console.log(err) });

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", function (req, res) {
    res.send("working")
})

app.listen(process.env.PORT || 3000, function () {
    console.log("BlogSite Server has started!");
})