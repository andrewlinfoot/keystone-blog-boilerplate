import keystone from 'keystone';

const User = keystone.list('User');
const Post = keystone.list('Post');

module.exports = (req, res) => {
  const view = new keystone.View(req, res);
  const locals = res.locals;

  const page = req.query.page || 1;

  // Get URL Params
  const authorSlug = req.params.author;

  // Init locals
  locals.section = 'authors';
  locals.filters = {
    page,
  };
  locals.data = {
    posts: {},
  };

  // Get Author object from slug in url
  view.on('init', (next) => {
    User.model.findOne()
      .where('slug', authorSlug)
      .exec((err, author) => {
        if (author) {
          locals.data.author = author;
          // Add filter for post search api
          locals.filters.author = author.id;
          next();
        } else {
          next(err);
        }
      });
  });

  // Get Posts for author
  view.on('init', (next) => {
    if (!locals.data.author) {
      // No author found
      next();
      return;
    }

    Post.model.search(locals.filters)
      .populate('author featuredImage')
      .exec((err, results) => {
        locals.data.posts = results;
        next(err);
      });
  });

  view.render('authors');
};
