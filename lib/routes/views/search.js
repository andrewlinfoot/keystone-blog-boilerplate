import keystone from 'keystone';

const Post = keystone.list('Post');

module.exports = (req, res) => {
  const view = new keystone.View(req, res);
  const locals = res.locals;

  // Route params
  const page = req.query.page || 1;
  const searchQuery = req.query.q || '';

  // Init locals
  locals.section = 'search';
  locals.filters = {
    page,
  };
  locals.data = {
    posts: {},
  };

  // Load the posts
  view.on('init', (next) => {
    if (!searchQuery) {
      // No Search query
      next();
      return;
    }

    locals.filters.search = searchQuery;

    Post.model.search(locals.filters)
      .populate('author featuredImage')
      .exec((err, response) => {
        locals.data.posts = response;
        next(err);
      });
  });

  // Render the view
  view.render('search');
};
