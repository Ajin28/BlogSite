const express = require("express"),
    bodyParser = require("body-parser"),
    mongoose = require("mongoose"),
    app = express();

//APP CONFIG
mongoose.connect("mongodb://localhost:27017/BlogSite", { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => { console.log("Connected to DB!") })
    .catch((err) => { console.log(err) });
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

//MODEL CONFIG
const blogSchema = new mongoose.Schema({
    title: String,
    image: String,
    body: String,
    created: {
        type: Date, default: Date.now()
    }
});
const Blog = mongoose.model("Blog", blogSchema)

// Blog.create({
//     title: "Test Blog",
//     image: "https://images.unsplash.com/photo-1515002246390-7bf7e8f87b54?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60",
//     body: "Kedi was such an awesome movie. I think everyone should see it. It was a piece of art from start to finish. Just mesmerizing"
// });

//RESTFUL ROUTES
app.get("/", (req, res) => {
    res.redirect("/blogs")
})

//INDEX route
app.get('/blogs', function (req, res) {
    Blog.find({}, function (err, blogs) {
        if (err) {
            console.log(err)
        }
        else {
            res.render("index", { blogs })
        }
    })
});

//NEW route
app.get('/blogs/new', function (req, res) {
    res.render("new")
});

//CREATE route
app.post('/blogs', function (req, res) {
    Blog.create(req.body.blog, function (err, newBlog) {
        if (err) {
            console.log(err)
        } else {
            res.redirect("/blogs");
        }
    })
});

app.listen(process.env.PORT || 3000, function () {
    console.log("BlogSite Server has started!");
})