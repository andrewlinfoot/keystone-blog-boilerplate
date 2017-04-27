import keystone from 'keystone';

const Post = keystone.list('Post');
const utils = keystone.utils;

module.exports = (req, res) => {
  const view = new keystone.View(req, res);
  const locals = res.locals;

  // Get route params
  const page = req.query.page || 1;
  const category = utils.keyToProperty(req.params.category);

  // Init locals
  locals.section = category;
  locals.filters = {
    category,
    page,
  };
  locals.data = {
    posts: {},
  };

  // Load the posts
  view.on('init', (next) => {
    Post.model.search(locals.filters)
      .populate('author featuredImage tags')
      .exec((err, results) => {
        locals.data.posts = results;
        next(err);
      });
  });

  // Render the view
  view.render('category');
};
