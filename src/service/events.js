/**
 * Mapa de eventos que são recebidos e enviados pelo back-end
 */
const events = {
  NEW_USER: 'newUser',
  USER_LOGGED_IN: 'userLoggedIn',
  USER_LOGGED_OFF: 'userLoggedOff',
  USER_IS_TYPING: 'userIsTyping',
  NEW_MESSAGE_SENDED: 'newMessageSended',
  NEW_MESSAGE_RECEIVED: 'newMessageReceived',
  ALL_MESSAGES_AFTER_DATE: 'allMessagesAfterDate'
};

module.exports = events;
