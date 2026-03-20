import serverConfig from '../../config/serverConfig.js';

const createMailObject = ({ to, subject, html, text }) => ({
  from: serverConfig.MAIL_FROM,
  to,
  subject,
  html,
  text,
});

export default createMailObject;
