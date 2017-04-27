import mailgunJs from 'mailgun-js';

const MAILGUN_API_KEY = process.env.MAILGUN_API_KEY;
const MAILGUN_DOMAIN = process.env.MAILGUN_DOMAIN;
const CONTACT_EMAIL = process.env.CONTACT_EMAIL;

module.exports = (req, res) => {
  const name = req.body.contactname;
  const email = req.body.contactemail;
  const subject = req.body.contactsubject;
  const message = req.body.contactmessage;

  if (!MAILGUN_API_KEY ||
    !MAILGUN_DOMAIN) {
    console.error('Must set MAILGUN_API_KEY, MAILGUN_DOMAIN enviroment variables to use the contact form.');
    res.apiResponse('Error: Contact form not configured properly');
    return;
  }
  const mailgun = mailgunJs({
    apiKey: MAILGUN_API_KEY,
    domain: MAILGUN_DOMAIN,
  });

  if (!name || !email || !subject || !message) {
    res.apiResponse('Error: No need all contact info');
    return;
  }

  mailgun.messages().send({
    from: `${name} <${email}>`,
    to: CONTACT_EMAIL,
    subject,
    message,
  }, (error) => {
    if (error) {
      res.apiResponse(error);
    } else {
      res.apiResponse({
        success: true,
      });
    }
  });
};
