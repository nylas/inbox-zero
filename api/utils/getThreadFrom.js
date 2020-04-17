/**
 * Finds the last message in the given thread that was not sent
 * by the current account and returns the first "from" name and email
 */
module.exports = function getThreadFrom(thread) {
  const lastMessageReceived = thread.messages.find(message => {
    return (
      message.date.getTime() === thread.lastMessageReceivedTimestamp.getTime()
    );
  });

  return lastMessageReceived.from[0];
};
