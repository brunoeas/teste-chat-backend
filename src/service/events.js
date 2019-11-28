/**
 * Mapa de eventos que são recebidos e enviados pelo back-end
 */
const events = {
  NEW_USER: 'newUser',
  USER_LOGGED_IN: 'userLoggedIn',
  USER_LOGGED_OFF: 'userLoggedOff',
  USER_IS_TYPING: 'userIsTyping',
  NEW_MESSAGE: 'newMessage',
  ERROR: 'Error',
  RESPONSE: 'Response'
};

module.exports = events;
