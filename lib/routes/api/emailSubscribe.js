import request from 'request';

const MAILCHIMP_LIST_ID = process.env.MAILCHIMP_LIST_ID;
const MAILCHIMP_API_KEY = process.env.MAILCHIMP_API_KEY;

module.exports = (req, res) => {
  const email = req.body.email;

  if (!MAILCHIMP_LIST_ID ||
    !MAILCHIMP_API_KEY) {
    console.error('Must set MAILCHIMP_LIST_ID, MAILCHIMP_API_KEY enviroment variables to use email subscribe');
    res.apiResponse('Error: Email subscribe not configured properly');
    return;
  }

  if (!email) {
    res.apiResponse('Error: No email param defined');
    return;
  }

  // Parse zone from api key
  const zone = MAILCHIMP_API_KEY.split('-').pop();
  // Add email to mailchimp
  const url = `https://${zone}.api.mailchimp.com/2.0/lists/subscribe.json?apikey=${MAILCHIMP_API_KEY}&id=${MAILCHIMP_LIST_ID}&email[email]=${email}&send_welcome=true`;
  request.post(url);

  res.apiResponse({
    success: true,
  });
};
