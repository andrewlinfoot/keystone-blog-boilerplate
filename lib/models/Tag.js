import keystone from 'keystone';

const Types = keystone.Field.Types;

/**
 * Tag Model
 * ==================
 */
const Tag = new keystone.List('Tag', {
  autokey: {
    from: 'name',
    path: 'slug',
    unique: true,
  },
  track: true,
});

Tag.add({
  name: {
    type: Types.Text,
    required: true,
  },
});

/**
 * Virtual Properties
 */
function url() {
  return `/tag/${this.slug}`;
}
Tag.schema.virtual('url').get(url);

Tag.register();
