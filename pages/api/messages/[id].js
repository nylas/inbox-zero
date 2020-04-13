import protect from "../../../middleware/protect";

/**
 * Retrieves a list of messages that belong to the current user which
 * match the given parameters.
 */
export default protect(async (req, res) => {
  if (req.method === "GET") {
    return getMessageRequest(req, res);
  }
  if (req.method === "PUT") {
    return updateMessageRequest(req, res);
  } else {
    res.status(405).end();
  }
});

async function getMessageRequest(req, res) {
  try {
    res.status(200).json(await getMessageById(req.nylas, req.query.id));
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Something went wrong. Please try again." });
  }
}

async function updateMessageRequest(req, res) {
  try {
    const id = req.query.id;
    const fullMessage = await req.nylas.messages.find(id);

    if (req.body.unread === false) {
      fullMessage.unread = false;
    }

    if (req.body.labels) {
      // replace all but the default labels
      const messageDefaultLabels = fullMessage.labels.filter(label =>
        defaultLabels.includes(label.name)
      );
      fullMessage.labels = [...messageDefaultLabels, ...req.body.labels];
    }

    if (req.body.senderUnread === false) {
      const fromEmailAddress = fullMessage.from[0].email;
      const unreadMessages = await req.nylas.messages.list({
        in: "inbox",
        from: fromEmailAddress,
        unread: true
      });

      await Promise.all(
        unreadMessages.map(message => {
          message.unread = false;
          return message.save();
        })
      );
    }

    await fullMessage.save();

    const u = await getMessageById(req.nylas, id);

    res.status(200).json(u);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Something went wrong. Please try again." });
  }
}

async function getMessageById(nylas, id) {
  const fullMessage = await nylas.messages.find(id);
  const fromEmailAddress = fullMessage.from[0].email;
  const thread = await nylas.threads.find(fullMessage.threadId, null, {
    view: "expanded"
  });

  const senderUnreadCount = await nylas.messages.count({
    in: "inbox",
    from: fromEmailAddress,
    unread: true
  });

  const accountLabels = thread.labels
    ? (await nylas.labels.list())
        .filter(label => !defaultLabels.includes(label.name))
        .map(simplifyLabel)
    : [];

  const previousThreads = await nylas.threads.list({
    in: "inbox",
    unread: true,
    last_message_after: thread.lastMessageTimestamp,
    limit: 1000
  });

  const nextThreads = await nylas.threads.list({
    in: "inbox",
    unread: true,
    last_message_before: thread.lastMessageTimestamp,
    limit: 1
  });

  return {
    unread: thread.unread,
    senderUnread: senderUnreadCount > 0,
    labels: accountLabels.map(label => {
      return {
        ...label,
        checked: !!thread.labels.find(({ id }) => id === label.id)
      };
    }),
    messages: thread.messages.map(message => {
      const isActiveMessage = message.id === fullMessage.id;

      return {
        active: isActiveMessage,
        ...simplifyMessage(isActiveMessage ? fullMessage : message)
      };
    }),
    previousThreadId:
      previousThreads.length > 0
        ? last(last(previousThreads).messageIds)
        : null,
    nextThreadId:
      nextThreads.length > 0 ? last(nextThreads[0].messageIds) : null
  };
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

const defaultLabels = [
  "inbox",
  "all",
  "trash",
  "archive",
  "drafts",
  "sent",
  "spam",
  "important"
];

function simplifyLabel(label) {
  return {
    id: label.id,
    displayName: label.displayName
  };
}

function last(arr) {
  return arr[arr.length - 1];
}
