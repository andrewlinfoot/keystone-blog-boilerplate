import keystone from 'keystone';

const Types = keystone.Field.Types;

/**
 * ImageCache Model
 * ==========
 * Cache Cloudinary images to S3 to save $$ by reducing Cloudinary bandwidth
 */
const ImageCache = new keystone.List('ImageCache');

ImageCache.add({
  hash: {
    type: Types.Text,
    index: true,
  },
  uploaded: {
    type: Types.Boolean,
    index: true,
  },
});

ImageCache.register();
