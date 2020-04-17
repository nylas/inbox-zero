/**
 * Retrieves a list of messages that belong to the current user which
 * match the given parameters.
 */
module.exports = async (req, res) => {
  try {
    res.status(200).json(
      await getThreadById({
        nylas: req.nylas,
        id: req.params.id,
        account: req.account
      })
    );
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Something went wrong. Please try again." });
  }
};

async function getThreadById({ nylas, id, account }) {
  const thread = await nylas.threads.find(id, null, { view: "expanded" });
  const firstMessageReceived =
    thread.messages.find(message => {
      return message.from[0].email !== account.emailAddress;
    }) || thread.messages[0];

  const fromEmailAddress = firstMessageReceived.from[0].email;

  const [
    senderUnreadCount,
    allLabels,
    previousThreads,
    nextThreads
  ] = await Promise.all([
    nylas.messages.count({
      in: "inbox",
      from: fromEmailAddress,
      unread: true,
      limit: 1
    }),
    thread.labels ? nylas.labels.list() : Promise.resolve([]),
    nylas.threads.list({
      in: "inbox",
      unread: true,
      last_message_after: thread.lastMessageTimestamp,
      limit: 1000
    }),
    nylas.threads.list({
      in: "inbox",
      unread: true,
      last_message_before: thread.lastMessageTimestamp,
      limit: 1
    })
  ]);

  const accountLabels = thread.labels
    ? allLabels
        .filter(label => !defaultLabels.includes(label.name))
        .map(simplifyLabel)
    : [];

  const messages = await nylas.messages.list({
    thread_id: id,
    view: "expanded"
  });

  return {
    id: thread.id,
    subject: thread.subject,
    from: {
      name: firstMessageReceived.from[0].name,
      email: firstMessageReceived.from[0].email
    },
    messages: messages.map(simplifyMessage),
    participants: thread.participants,
    date: thread.lastMessageTimestamp,
    snippet: thread.snippet,
    unread: thread.unread,
    hasAttachments: thread.hasAttachments,
    unread: thread.unread,
    senderUnread: senderUnreadCount > 0,
    labels: accountLabels.map(label => {
      return {
        ...label,
        checked: !!thread.labels.find(({ id }) => id === label.id)
      };
    }),
    previousThreadId:
      previousThreads.length > 0 ? last(previousThreads).id : null,
    nextThreadId: nextThreads.length > 0 ? nextThreads[0].id : null
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

function simplifyMessage(message) {
  return {
    id: message.id,
    subject: message.subject,
    from: message.from,
    to: message.to,
    cc: message.cc,
    bcc: message.bcc,
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
