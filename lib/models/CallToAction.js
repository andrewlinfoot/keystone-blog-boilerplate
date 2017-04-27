import keystone from 'keystone';

const Types = keystone.Field.Types;

/**
 * CallToAction Model
 * ==================
 * Add calls to action to the bottom of blog posts. By keeping calls to action
 *   seperate from individual post copy, you can easilly update across the site
 *   as business needs change.
 */
const CallToAction = new keystone.List('CallToAction', {
  autokey: {
    from: 'name',
    path: 'slug',
    unique: true,
  },
  track: true,
});

CallToAction.add({
  name: {
    type: Types.Text,
    required: true,
    index: true,
    initial: true,
  },
  copy: {
    type: Types.Html,
    wysiwyg: true,
    height: 400,
    required: true,
    initial: true,
  },
});

CallToAction.register();
