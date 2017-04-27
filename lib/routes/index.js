/**
 * This file is where you define your application routes and controllers.
 *
 * Start by including the middleware you want to run for every request;
 * you can attach middleware to the pre('routes') and pre('render') events.
 *
 * For simplicity, the default setup for route controllers is for each to be
 * in its own file, and we import all the files in the /routes/views directory.
 *
 * Each of these files is a route controller, and is responsible for all the
 * processing that needs to happen for the route (e.g. loading data, handling
 * form submissions, rendering the view template, etc).
 *
 * Bind each route pattern your application should respond to in the function
 * that is exported from this module, following the examples below.
 *
 * See the Express application routing documentation for more information:
 * http://expressjs.com/api.html#app.VERB
 */
import keystone from 'keystone';
import browserify from 'browserify-middleware';
import siteConfig from '../siteConfig';

const importRoutes = keystone.importer(__dirname);
const staticPages = siteConfig.staticPages;

// Import Route Controllers
const routes = {
  views: importRoutes('./views'),
  api: importRoutes('./api'),
  middleware: importRoutes('./middleware'),
};

keystone.pre('routes', routes.middleware.initLocals);
keystone.pre('routes', routes.middleware.siteCopy);
keystone.pre('routes', routes.middleware.imageCache);
keystone.pre('render', routes.middleware.metaTags);

// Setup Route Bindings
module.exports = (app) => {
  // Client side javascript bundles
  app.get('/js/bundle.js', browserify(`${__dirname}/../client/js/bundle.js`));

  // API Routes
  app.get('/api/post/search', keystone.middleware.api, routes.api.post.search);
  app.post('/api/emailsubscribe', keystone.middleware.api, routes.api.emailSubscribe);
  app.post('/api/contact', keystone.middleware.api, routes.api.contact);

  // Views
  app.get('/', routes.views.index);
  app.get('/search', routes.views.search);
  staticPages.forEach(staticPage => app.get(staticPage.route, routes.views.staticPage));
  app.get('/tag/:tag', routes.views.tag);
  app.get('/authors/:author', routes.views.authors);
  app.get('/:category', routes.views.category);
  app.get('/category/:category', routes.views.category);
  app.get('/post/:post', routes.views.post);
};
