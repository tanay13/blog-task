var express = require('express');
var router = express.Router();
var Blog = require('../model/blog');
const { verifyLogin } = require('../middleware/middleware');
const User = require('../model/user');

router.get('/new', verifyLogin, (req, res) => {
  console.log(res.locals.user);
  res.render('new');
});

router.get('/landing', async (req, res) => {
  const blogs = await Blog.find({});
  res.render('landing', { blogs });
});

router.get('/:id', (req, res) => {
  Blog.findById(req.params.id, function (err, foundBlog) {
    if (err) {
      console.log(err);
    } else {
      res.render('desc', { blog: foundBlog });
    }
  });
});

router.post('/new', function (req, res) {
  var name = req.body.name;
  var image = req.body.image;
  var desc = req.body.description;
  var author = {
    id: res.locals.user._id,
    username: res.locals.user.username,
  };

  var newBlog = { name: name, image: image, description: desc, author: author };
  //create new blog and save to database
  Blog.create(newBlog, function (err, newlyCreated) {
    if (err) {
      console.log(err);
    } else {
      res.redirect('/blogs/landing');
    }
  });
});

router.delete('/:id', (req, res) => {
  Blog.findById(req.params.id, function (err, blog) {
    if (err) {
      return console.log(err);
    } else {
      if (blog.author.id.equals(res.locals.user._id)) {
        Blog.findByIdAndRemove(req.params.id, function (err) {
          if (err) {
            res.redirect('/blogs/landing');
          } else {
            res.redirect('/blogs/landing');
          }
        });
      }
    }
  });
});

module.exports = router;
