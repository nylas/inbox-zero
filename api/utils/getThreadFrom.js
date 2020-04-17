module.exports = function getThreadFrom({ thread, account }) {
  const firstMessageReceived = thread.messages.find(message => {
    return message.from[0].email !== account.emailAddress;
  });

  return (firstMessageReceived || thread.messages[0]).from[0];
};
