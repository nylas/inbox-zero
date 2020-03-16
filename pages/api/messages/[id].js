import protect from "../../../utils/middleware/protect";
import replyParser from 'node-email-reply-parser'
/**
 * Retrieves a list of messages that belong to the current user which
 * match the given parameters.
 */
export default protect(async (req, res) => {
  try {
    const id = req.query.id;

    const fullMessage = await req.nylas.messages.find(id);
    const fromEmailAdress = fullMessage.from[0].email
    const thread = await req.nylas.threads.find(fullMessage.threadId, null, { view: 'expanded' });
    const senderUnreadCount = await req.nylas.messages.count({
      from: fromEmailAdress,
      unread: true
    })

    // console.log(thread.labels)

    res.status(200).json({
      senderUnread: senderUnreadCount > 0,
      threadUnread: thread.unread,
      messages: thread.messages.map((message) => {
        if (message.id === fullMessage.id) {
          return simplifyMessage({
            active: true,
            ...fullMessage.toJSON()
          })
        }

        return simplifyMessage({
          active: false,
          ...message.toJSON()
        })
      })
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Something went wrong. Please try again." });
  }
});


function simplifyMessage(message) {
  return {
    active: message.active,
    id: message.id,
    subject: message.subject,
    from: message.from,
    date: message.date,
    unread: message.unread,
    body: replyParser(message.body, true),
    hasAttachments: message.hasAttachments || message.files.length > 0,
    files: message.files || []
  };
}
