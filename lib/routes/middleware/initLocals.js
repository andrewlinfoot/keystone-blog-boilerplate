/**
  Initialises the standard view local

  The included layout depends on the navLinks array to generate
  the navigation in the header, you may wish to change this array
  or replace it with your own templates / logic.
*/
import siteConfig from '../../siteConfig';

module.exports = (req, res, next) => {
  const locals = res.locals;

  locals.navLinks = siteConfig.navLinks;
  locals.user = req.user;
  locals.site = Object.assign(siteConfig.site, {
    url: `${req.protocol}://${req.hostname}`,
  });

  next();
};
