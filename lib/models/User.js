import keystone from 'keystone';

const Types = keystone.Field.Types;

/**
 * User Model
 * ==========
 */
const User = new keystone.List('User', {
  autokey: {
    path: 'slug',
    from: 'name',
    unique: true,
    fixed: true,
  },
  defaultColumns: 'name, email, isAdmin',
});

User.add({
  name: {
    type: Types.Name,
    required: true,
    index: true,
  },
  email: {
    type: Types.Email,
    initial: true,
    required: true,
    index: true,
  },
  password: {
    type: Types.Password,
    initial: true,
    required: true,
  },
  profilePicture: {
    type: Types.CloudinaryImage,
  },
  slug: {
    type: Types.Text,
  },
  title: {
    type: Types.Text,
  },
  bio: {
    type: Types.Html,
    wysiwyg: true,
    height: 150,
  },
}, 'Social Accounts', {
  facebook: {
    type: Types.Text,
  },
  twitter: {
    type: Types.Text,
  },
  linkedIn: {
    type: Types.Text,
  },
  instagram: {
    type: Types.Text,
  },
}, 'Permissions', {
  isAdmin: {
    type: Boolean,
    label: 'Can access Keystone',
    index: true,
  },
});


/**
 * Virtuals
 */

// Provide access to Keystone
function canAccessKeystone() {
  return this.isAdmin;
}
User.schema.virtual('canAccessKeystone').get(canAccessKeystone);

/**
 * Relationships
 */

User.relationship({
  ref: 'Post',
  path: 'posts',
  refPath: 'author',
});


/**
 * Registration
 */
User.register();
