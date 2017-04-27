import _ from 'lodash';
import keystone from 'keystone';

const Post = keystone.list('Post');

module.exports.search = (req, res) => {
  // Filters, page, search query, category, tag, homepage
  const options = req.query;

  Post.model.search(options)
    .populate('author featuredImage', '-email, -password') // Exclude email and password
    .exec((err, response) => {
      if (err) {
        res.apiError('Error', err);
        return;
      }

      const apiResponse = {
        posts: response.results,
        next: response.next,
      };

      const template = req.query.template;
      if (!template) {
        // No template, return json response
        res.apiResponse(apiResponse);
        return;
      }

      // Render template HTML and return response
      let templateOptions = req.query.templateOptions || {};
      templateOptions = _.extend(templateOptions, {
        posts: response,
      });
      res.render(`api/${template}`, templateOptions,
        (error, html) => {
          if (error) {
            res.apiError('Error ', error);
            return;
          }

          apiResponse.html = html;
          res.apiResponse(apiResponse);
        });
    });
};
