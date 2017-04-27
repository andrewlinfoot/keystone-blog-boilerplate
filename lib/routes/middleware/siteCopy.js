const keystone = require('keystone');

const SiteCopy = keystone.list('SiteCopy');

/**
  Gets the site copy
 */
module.exports = (req, res, next) => {
  const locals = res.locals;

  SiteCopy.model.findOne()
    .exec((err, result) => {
      locals.siteCopy = result;
      next(err);
    });
};
