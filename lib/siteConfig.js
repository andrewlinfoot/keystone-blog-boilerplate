const siteConfig = {
  site: {
    name: 'keystone-blog-boilerplate',
    description: '',
    fbAppId: '',
    fbPageId: '',
  },
  navLinks: [{
    label: 'About',
    key: 'about',
    href: '/about',
  }, {
    label: 'Blog',
    key: 'blog',
    href: '/blog',
  }, {
    label: 'Contact',
    key: 'contact',
    href: '/contact',
  }],
  staticPages: [{
    key: 'contact',
    route: '/contact',
  }, {
    key: 'about',
    route: '/about',
  }],
  // Keystone Params
  cloudinaryPrefix: '',
  keystoneNav: {
    siteCopy: 'site-copies',
    posts: 'posts',
    media: 'media',
    tags: 'tags',
    callsToAction: 'call-to-actions',
    users: 'users',
  },
};
export default siteConfig;
