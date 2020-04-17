const { DEFAULT_LABELS } = require("../../utils/constants");
const getThreadFrom = require("../../utils/getThreadFrom");

/**
 * Description: Retrieves an email thread
 * Endpoint:    GET /api/threads/:id
 * Response:
 * {
 *   id: String,
 *   subject: String,
 *   from: { name: String, email: String },
 *   messages: [
 *     {
 *       id: String,
 *       subject: String,
 *       from: [
 *         { name: String, email: String }
 *       ],
 *       to: [
 *         { name: String, email: String }
 *       ],
 *       cc: [
 *         { name: String, email: String }
 *       ],
 *       bcc: [
 *         { name: String, email: String }
 *       ],
 *       date: Timestamp,
 *       unread: Boolean,
 *       body: String,
 *       hasAttachments: Boolean,
 *       files: [
 *         { filename: String, id: String }
 *       ],
 *     }
 *   ],
 *   date: Timestamp,
 *   snippet: String,
 *   hasAttachments: Boolean,
 *   unread: Boolean,
 *   senderUnread: Boolean,
 *   labels: [
 *     {
 *       id: String,
 *       displayName: String,
 *       checked: Boolean
 *     }
 *   ],
 *   previousThreadId: String|null,
 *   nextThreadId: String|null
 * }
 */
module.exports = async (req, res) => {
  const nylas = req.nylas;
  const account = req.account;
  const id = req.params.id;

  try {
    const thread = await nylas.threads.find(id, null, { view: "expanded" });
    const threadFrom = getThreadFrom({ thread, account });
    const senderUnread = await checkIfSenderUnread({ nylas, account, thread });
    const { previousThreadId, nextThreadId } = await getThreadPagination({
      nylas,
      thread
    });
    const labels = await getThreadLabels({ nylas, account, thread });
    const messages = await nylas.messages.list({
      thread_id: id,
      view: "expanded"
    });

    return res.status(200).json({
      id,
      subject: thread.subject,
      from: threadFrom,
      messages: messages.map(simplifyMessage),
      date: thread.lastMessageTimestamp,
      snippet: thread.snippet,
      hasAttachments: thread.hasAttachments,
      unread: thread.unread,
      senderUnread,
      labels,
      previousThreadId,
      nextThreadId
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Something went wrong. Please try again." });
  }
};

async function checkIfSenderUnread({ nylas, account, thread }) {
  if (thread.unread) {
    return true;
  }

  const threadFrom = getThreadFrom({ thread, account });

  const senderUnreadCount = await nylas.messages.count({
    in: "inbox",
    from: threadFrom.email,
    unread: true,
    limit: 1
  });

  return senderUnreadCount > 0;
}

async function getThreadPagination({ nylas, thread }) {
  const [previousThreadIds, nextThreadIds] = await Promise.all([
    nylas.threads.list({
      in: "inbox",
      unread: true,
      last_message_after: thread.lastMessageTimestamp,
      limit: 1000,
      view: "ids"
    }),
    nylas.threads.list({
      in: "inbox",
      unread: true,
      last_message_before: thread.lastMessageTimestamp,
      limit: 1,
      view: "ids"
    })
  ]);

  const previousThreadId =
    previousThreadIds.length > 0
      ? previousThreadIds[previousThreadIds.length - 1]
      : null;
  const nextThreadId = nextThreadIds.length > 0 ? nextThreadIds[0] : null;

  return {
    previousThreadId,
    nextThreadId
  };
}

async function getThreadLabels({ nylas, account, thread }) {
  if (account.organizationUnit !== "label") {
    return [];
  }

  const accountLabels = await nylas.labels.list();

  // return labels without any of the default labels we don't want to be visible
  return accountLabels
    .filter(label => !DEFAULT_LABELS.includes(label.name))
    .map(label => {
      return {
        id: label.id,
        displayName: label.displayName,
        checked: !!thread.labels.find(({ id }) => id === label.id)
      };
    });
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
    body: message.body,
    hasAttachments: message.files.length > 0,
    files: message.files
      ? message.files.map(({ filename, id }) => {
          return { filename: filename || "noname", id };
        })
      : []
  };
}
