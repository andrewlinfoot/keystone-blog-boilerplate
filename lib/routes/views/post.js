import keystone from 'keystone';

const Post = keystone.list('Post');

module.exports = (req, res) => {
  const view = new keystone.View(req, res);
  const locals = res.locals;

  // Get URL Params
  const postSlug = req.params.post;
  const category = req.params.category;

  // Set locals
  locals.section = category;
  locals.filters = {
    post: postSlug,
  };
  locals.data = {
    posts: {},
  };

  // Load the current post
  view.on('init', (next) => {
    Post.model.findOnePublished(postSlug, req.user)
      .populate('author featuredImage tags callToAction')
      .exec((err, post) => {
        locals.data.post = post;
        if (post) {
          locals.title = post.title;
          post.countUniquePageview(req);
        }
        next(err);
      });
  });

  // Render the view
  view.render('post');
};
