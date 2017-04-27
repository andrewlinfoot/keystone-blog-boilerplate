import keystone from 'keystone';

const Post = keystone.list('Post');
const Tag = keystone.list('Tag');

module.exports = (req, res) => {
  const view = new keystone.View(req, res);
  const locals = res.locals;

  const page = req.query.page || 1;
  const tagSlug = req.params.tag;

  // Init locals
  locals.section = tagSlug;
  locals.filters = {
    page,
  };
  locals.data = {
    posts: {},
  };

  // Get Tag Id
  view.on('init', (next) => {
    Tag.model.findOne()
      .where('slug', tagSlug)
      .exec((err, result) => {
        if (result) {
          locals.filters.tag = result.id;
          locals.data.tag = result;
        }
        next(err);
      });
  });

  // Load the posts
  view.on('init', (next) => {
    if (!locals.filters.tag) {
      // No tag found
      next();
      return;
    }

    Post.model.search(locals.filters)
      .populate('author featuredImage tags')
      .exec((err, results) => {
        locals.data.posts = results;
        next(err);
      });
  });

  // Render the view
  view.render('tag');
};
