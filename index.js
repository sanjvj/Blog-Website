import express from "express";
import bodyParser from "body-parser";
import methodOverride from 'method-override';

const app = express();
const port = 3000;
const posts = [];

function record(req, res, next) {
  let title = req.body["title"];
  let description = req.body["description"];
  let content = req.body["blog-content"];
  const newPost = {
    id: posts.length + 1,
    title: title,
    description: description,
    content: content,
  };

  posts.push(newPost);

  next();
}

function deletePost(req, res, next) {
  const postId = parseInt(req.params.id);
  const indexToDelete = posts.findIndex(post => post.id === postId);
  
  if (indexToDelete !== -1) {
    posts.splice(indexToDelete, 1);
    
    // Update post IDs
    posts.forEach((post, index) => {
      post.id = index + 1;
    });
  }

  next();
}

function updatePost(req, res, next) {
  const postId = parseInt(req.params.id);
  const indexToUpdate = posts.findIndex(post => post.id === postId);

  if (indexToUpdate !== -1) {
    posts[indexToUpdate].title = req.body.title;
    posts[indexToUpdate].description = req.body.description;
    posts[indexToUpdate].content = req.body["blog-content"];
  }

  next();
}

app.use(methodOverride('_method'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/", (req, res) => {
  res.render("index.ejs", { posts: posts });
});

app.get("/title", (req, res) => {
  res.render("title.ejs");
});

app.post("/submit", record, (req, res) => {
  res.redirect("/");
});

app.get("/submit/:id", (req, res) => {
  const selectedPostIndex = parseInt(req.params.id) - 1;
  const selectedPost = posts[selectedPostIndex];

  res.render("view.ejs", {
    selectedPost,
  });
});

app.delete("/submit/:id", deletePost, (req, res) => {
  res.redirect("/");
});



app.get("/update/:id", (req, res) => {
  const selectedPostIndex = parseInt(req.params.id) - 1;
  const selectedPost = posts[selectedPostIndex];

  res.render("update.ejs", {
    selectedPost,
  });
});

app.patch("/update/:id", updatePost, (req, res) => {
  res.redirect("/");
});




app.listen(port, () => {
  console.log(`Server is running on ${port}`);
});
