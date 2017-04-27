import 'dotenv/config';
import 'newrelic';
import _ from 'lodash';
import keystone from 'keystone';
import siteConfig from './siteConfig';

keystone.init({
  name: siteConfig.site.name,
  brand: siteConfig.site.name,

  sass: 'public',
  static: 'public',
  // favicon: 'public/images/icons/favicon.ico',
  'view engine': 'jade',
  views: 'templates/views',
  'auto update': true,
  session: true,
  'session store': 'mongo',
  auth: true,
  'user model': 'User',

  // WYSIWYG Options
  'wysiwyg additional buttons': 'styleselect',
});

// Load your project's Models
keystone.import('models');
// Setup common locals for your templates. The following are required for the
// bundled templates and layouts. Any runtime locals (that should be set uniquely
// for each request) should be added to ./routes/middleware.js
keystone.set('locals', {
  _,
  env: keystone.get('env'),
  utils: keystone.utils,
  editable: keystone.content.editable,
});

// Load your project's Routes
keystone.set('routes', require('./routes'));

// Cloudinary Config Options
keystone.set('cloudinary folders', true);
keystone.set('cloudinary prefix', siteConfig.cloudinaryPrefix);

// Configure the navigation bar in Keystone's Admin UI
keystone.set('nav', siteConfig.keystoneNav);

// Start Keystone to connect to your database and initialise the web server
keystone.start();
