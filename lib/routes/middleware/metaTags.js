/**
 * Creates all of the meta tags for the head
 * Fields used by the jade mixin:
 *   siteName
 *   title
 *   url
 *   type
 *   description
 *   image
 *   socialTitle
 *   socialDescription
 *   googleSiteVerification
 *   fbAppId
 *   fbPageId
 *   twitterHandle
 */
import _ from 'lodash';

module.exports = (req, res, next) => {
  const locals = res.locals;
  const site = locals.site;
  const meta = {};

  // Tag Defaults
  meta.siteName = site.name;
  meta.title = site.name;
  meta.url = site.url;
  meta.type = 'website';
  meta.description = site.description;
  meta.image = `${site.url}images/og-image.jpg`; // should be 1200x630
  meta.fbAppId = site.fbAppId;
  meta.fbPageId = site.fbPageId;

  if (locals.data && locals.data.post) {
    const post = locals.data.post;

    meta.type = 'article';

    // Post page, use post data
    if (_.get(post, 'featuredImage.image.exists')) {
      meta.image.url = post.featuredImage._.image.fill(1200, 630);
    }

    meta.title = post.title;
    if (post.content) {
      meta.description = post.getExcerpt();
    }
  }

  locals.meta = meta;

  next();
};
