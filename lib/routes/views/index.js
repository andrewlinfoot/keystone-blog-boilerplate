import keystone from 'keystone';

const Post = keystone.list('Post');

module.exports = (req, res) => {
  const view = new keystone.View(req, res);
  const locals = res.locals;

  const page = req.query.page || 1;

  // Init locals
  locals.section = 'home';
  locals.filters = {
    home: true,
    page,
  };
  locals.data = {
    posts: {},
  };

  // Load the newest feature on homepage posts
  view.on('init', (next) => {
    Post.model.find()
      .where('state', 'published')
      .where('publishedDate').lt(new Date())
      .where('featureOnHomepage', true)
      .limit(3) // Number of featured posts for featured section
      .sort('-publishedDate')
      .populate('author featuredImage tags')
      .exec((err, result) => {
        locals.data.posts = result;
        next(err);
      });
  });

  // Render the view
  view.render('index');
};
