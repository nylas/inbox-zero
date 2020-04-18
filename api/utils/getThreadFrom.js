/**
 * Finds the last message in the given thread that was not sent
 * by the current account and returns the first "from" name and email
 */
module.exports = function getThreadFrom(thread) {
  const lastMessageReceivedTimestamp = (
    thread.lastMessageReceivedTimestamp || thread.lastMessageTimestamp
  ).getTime();

  const lastMessageReceived = thread.messages.find(message => {
    return message.date.getTime() === lastMessageReceivedTimestamp;
  });

  return lastMessageReceived.from[0];
};
