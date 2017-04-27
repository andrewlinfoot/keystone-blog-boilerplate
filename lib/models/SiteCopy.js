import keystone from 'keystone';

const Types = keystone.Field.Types;

/**
 * Site Copy Model
 * ==================
 * Create fields for parts of the site you want to be editable from the backend.
 *   The site copy middleware will grab this object and attach it to locals.siteCopy.
 *   There should only ever be one site copy document in the database.
 */
const SiteCopy = new keystone.List('SiteCopy', {
  autokey: {
    from: 'name',
    path: 'slug',
    unique: true,
  },
});

SiteCopy.add({
  name: {
    type: Types.Text,
    required: true,
  },
});

SiteCopy.register();
