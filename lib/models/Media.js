import keystone from 'keystone';

const Types = keystone.Field.Types;

/**
 * Media Model
 * ==========
 */
const Media = new keystone.List('Media', {
  autokey: {
    path: 'slug',
    from: 'name',
    unique: true,
  },
  track: true,
  defaultSort: '-createdAt',
});

Media.add({
  name: {
    type: Types.Text,
    required: true,
    index: true,
  },
  image: {
    type: Types.CloudinaryImage,
    initial: true,
  },
  caption: {
    type: Types.Html,
    wysiwyg: true,
    initial: true,
  },
  imageCredit: {
    type: Types.Text,
    initial: true,
  },
  imageCreditLink: {
    type: Types.Url,
    initial: true,
  },
});

Media.register();
