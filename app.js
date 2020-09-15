const express = require("express"),
    bodyParser = require("body-parser"),
    mongoose = require("mongoose"),
    methodOverride = require("method-override"),
    expressSanitizer = require("express-sanitizer"),
    app = express();

//APP CONFIG
mongoose.connect("mongodb://localhost:27017/BlogSite", { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false })
    .then(() => { console.log("Connected to DB!") })
    .catch((err) => { console.log(err) });
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(expressSanitizer());

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
    req.body.blog.body = req.sanitize(req.body.blog.body);
    //removes all script tags in input //allows other tags like h1 strong
    Blog.create(req.body.blog, function (err, newBlog) {
        if (err) {
            console.log(err)
        } else {
            res.redirect("/blogs");
        }
    })
});

//SHOW route
app.get('/blogs/:id', function (req, res) {
    Blog.findById(req.params.id, function (err, foundBlog) {
        if (err)
            res.redirect("/blogs")
        else {
            res.render("show", { blog: foundBlog })
        }
    })
});

//EDIT route
app.get('/blogs/:id/edit', function (req, res) {
    Blog.findById(req.params.id, function (err, foundBlog) {
        if (err)
            res.redirect("/blogs")
        else {
            res.render("edit", { blog: foundBlog })
        }
    })
});

//UPDATE route
app.put('/blogs/:id', function (req, res) {
    req.body.blog.body = req.sanitize(req.body.blog.body);
    let id = req.params.id;
    let newData = req.body.blog;
    Blog.findByIdAndUpdate(id, newData, function (err, updatedBlog) {
        if (err) {
            res.redirect("/blogs");
            console.log(err);
        }
        else {
            res.redirect("/blogs/" + id);
        }
    })
});

//DELETE route
app.delete('/blogs/:id', function (req, res) {
    let id = req.params.id;
    Blog.findByIdAndRemove(id, function (err, updatedBlog) {
        if (err) {
            res.redirect("/blogs");
            console.log(err);
        }
        else {
            res.redirect("/blogs");
        }
    })
});

app.listen(process.env.PORT || 3000, function () {
    console.log("BlogSite Server has started!");
})

// //extracting data named paramName
// form get method  - req.query.paramName
// form post method - req.body.paramName
// a href           - req.params.paramName