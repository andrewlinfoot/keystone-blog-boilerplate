import _ from 'lodash';
import keystone from 'keystone';
import siteConfig from '../../siteConfig';

module.exports = (req, res) => {
  const view = new keystone.View(req, res);
  const locals = res.locals;

  const path = req.path;
  const page = _.find(siteConfig.staticPages, { route: path });
  locals.section = page.key;

  // Init locals
  locals.filters = {};
  locals.data = {};

  // Render the view
  view.render(locals.section);
};
