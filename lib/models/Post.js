import moment from 'moment';
import keystone from 'keystone';

const Types = keystone.Field.Types;
const utils = keystone.utils;

/**
 * Post Model
 * ==========
 */
const Post = new keystone.List('Post', {
  map: {
    name: 'title',
  },
  autokey: {
    path: 'slug',
    from: 'title',
    unique: true,
    fixed: true,
  },
  defaultSort: '-createdAt',
  defaultColumns: 'title, state, author, publishedDate',
  track: true,
});

Post.add({
  title: {
    type: Types.Text,
    required: true,
    index: true,
  },
  slug: {
    type: Types.Text,
  },
  state: {
    type: Types.Select,
    options: 'draft, published, archived',
    default: 'draft',
    index: true,
  },
  author: {
    type: Types.Relationship,
    ref: 'User',
    index: true,
  },
  publishedDate: {
    type: Types.Datetime,
    index: true,
    dependsOn: {
      state: 'published',
    },
  },
  featuredImage: {
    type: Types.Relationship,
    ref: 'Media',
    createInline: true,
  },
  content: {
    type: Types.Html,
    wysiwyg: true,
    height: 400,
  },
  category: {
    type: Types.Select,
    options: 'blog, uncategorized',
    default: 'uncategorized',
    index: true,
  },
  tags: {
    type: Types.Relationship,
    ref: 'Tag',
    many: true,
    createInline: true,
  },
  callToAction: {
    type: Types.Relationship,
    ref: 'CallToAction',
    createInline: true,
  },
  searchString: {
    type: Types.Text,
    hidden: true,
  },
});

// Boolean Switches
Post.add({
  heading: 'Advanced Options',
}, {
  hideFeaturedImage: {
    type: Types.Boolean,
  },
  featureOnHomepage: {
    type: Types.Boolean,
    default: false,
  },
});

// Post Stats
Post.add({
  heading: 'Post Stats',
}, {
  uniquePageviews: {
    type: Types.Number,
    noedit: true,
    default: 0,
    index: true,
  },
});

/**
 * Pre Save
 */

// Create searchable string
function searchableString(next) {
  const self = this;

  // Make title searchable
  let searchString = `${this.title} `;

  // Make subtitle searchable
  if (this.subHeadline !== undefined) {
    searchString += `${this.subHeadline} `;
  }

  // Make tags searchable
  keystone.list('Tag').model.find()
    .where('_id').in(this.tags)
    .exec((err, results) => {
      if (!err) {
        results.forEach((result) => {
          searchString += `${result.name} `;
        });
      }
      self.searchString = searchString;
      next();
    });
}
Post.schema.pre('save', searchableString);

/**
 * Virtual Properties
 */
function url() {
  return `/post/${this.slug}`;
}
Post.schema.virtual('url').get(url);

function publishedDay() {
  return this.publishedDate.getDate();
}
Post.schema.virtual('publishedDay').get(publishedDay);

function publishedMonth() {
  return moment(this.publishedDate).format('MMM');
}
Post.schema.virtual('publishedMonth').get(publishedMonth);

/**
 * Methods
 */
function getExcerpt(numberOfChars) {
  const contentAsText = utils.htmlToText(this.content);
  return utils.cropString(contentAsText, numberOfChars || 250, '...', true);
}
Post.schema.methods.getExcerpt = getExcerpt;

function countUniquePageview(req) {
  // Don't count admin user pageviews
  if (!(req.user && req.user.isAdmin)) {
    this.model('Post').update({
      _id: this.id,
    }, {
      $inc: {
        uniquePageviews: 1,
      },
    }).exec();
  }
}
Post.schema.methods.countUniquePageview = countUniquePageview;

/**
 * Statics
 */
function findOnePublished(postSlug, user) {
  const q = Post.model.findOne()
    .where('slug', postSlug);

  // Allow admin users to view posts
  // that are not published
  if (!(user && user.isAdmin)) {
    q.where('state', 'published');
    q.where('publishedDate').lt(new Date());
  }

  return q;
}

Post.schema.statics.findOnePublished = findOnePublished;

function findPublished(options = {}) {
  const resultsPerPage = options.resultsPerPage || 12;
  const page = options.page || 1;
  const filters = options.filters || {};

  return keystone.list('Post').paginate({
    page,
    perPage: resultsPerPage,
    maxPages: 1,
    filters,
  })
  .where('state', 'published')
  .where('publishedDate')
  .lt(new Date());
}
Post.schema.statics.findPublished = findPublished;

// Search
function search(options = {}) {
  const filters = {};

  // Filter Search
  const searchQuery = options.search;
  if (searchQuery) {
    filters.searchString = {
      $regex: `.*${searchQuery}.*`,
      $options: '-i',
    };
  }

  // Filter Category
  const category = options.category;
  if (category) {
    filters.category = category;
  }

  // Filter Multiple Categories
  const categories = options.categories;
  if (categories && categories.length > 0) {
    filters.category = {
      $in: categories,
    };
  }

  // Filter Tag : Note use tag ID
  const tag = options.tag;
  if (tag) {
    filters.tags = tag;
  }

  // Filter Multiple Tags
  const tags = options.tags;
  if (tags && tags.length > 0) {
    filters.tags = {
      $in: tags,
    };
  }

  // Filter Author
  const author = options.author;
  if (author) {
    filters.author = author;
  }

  const optionsCopy = Object.assign({}, options, { filters });

  const q = this.findPublished(optionsCopy)
    .sort('-publishedDate');

  return q;
}
Post.schema.statics.search = search;

Post.register();
