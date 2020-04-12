import protect from "../../../utils/middleware/protect";
import cleanLabels from "../../../utils/cleanLabels";

/**
 * Retrieves a list of messages that belong to the current user which
 * match the given parameters.
 */
export default protect(async (req, res) => {
  if (req.method === "GET") {
    return getMessage(req, res);
  }
  if (req.method === "PUT") {
    return updateMessage(req, res);
  } else {
    res.status(405).end();
  }
});

async function getMessage(req, res) {
  try {
    const id = req.query.id;
    const fullMessage = await req.nylas.messages.find(id);
    const fromEmailAddress = fullMessage.from[0].email;
    const thread = await req.nylas.threads.find(fullMessage.threadId, null, {
      view: "expanded"
    });
    const senderUnreadCount = await req.nylas.messages.count({
      in: "inbox",
      from: fromEmailAddress,
      unread: true
    });

    res.status(200).json({
      unread: thread.unread,
      senderUnread: senderUnreadCount > 0,
      messages: thread.messages.map(message => {
        const isActiveMessage = message.id === fullMessage.id;

        return {
          active: isActiveMessage,
          ...simplifyMessage(isActiveMessage ? fullMessage : message)
        };
      })
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Something went wrong. Please try again." });
  }
}

async function updateMessage(req, res) {
  try {
    const id = req.query.id;
    const fullMessage = await req.nylas.messages.find(id);

    if (req.body.unread === false) {
      fullMessage.unread = false;
      fullMessage.save();
    }

    if (req.body.senderUnread === false) {
      const fromEmailAddress = fullMessage.from[0].email;
      const unreadMessages = await req.nylas.messages.list({
        in: "inbox",
        from: fromEmailAddress,
        unread: true
      });

      for (const message of unreadMessages) {
        message.unread = false;
        message.save();
      }
    }

    res.status(200).end();
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Something went wrong. Please try again." });
  }
}

function simplifyMessage(message) {
  return {
    id: message.id,
    subject: message.subject,
    from: message.from,
    date: message.date,
    unread: message.unread,
    body: message.body,
    hasAttachments: message.hasAttachments || message.files.length > 0,
    files: message.files
      ? message.files.map(({ filename, id }) => {
          return { filename: filename || "noname", id };
        })
      : []
  };
}
