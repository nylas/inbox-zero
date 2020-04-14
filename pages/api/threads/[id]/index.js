import protect from "../../../../middleware/protect";

/**
 * Retrieves a list of messages that belong to the current user which
 * match the given parameters.
 */
export default protect(async (req, res) => {
  if (req.method === "GET") {
    return getThreadRequest(req, res);
  }
  if (req.method === "PUT") {
    return updateThreadRequest(req, res);
  } else {
    res.status(405).end();
  }
});

async function getThreadRequest(req, res) {
  try {
    res.status(200).json(await getThreadById(req.nylas, req.query.id));
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Something went wrong. Please try again." });
  }
}

async function updateThreadRequest(req, res) {
  try {
    const id = req.query.id;
    const thread = await req.nylas.threads.find(id);

    if (req.body.unread === false) {
      thread.unread = false;
    }

    if (req.body.labels) {
      // replace all but the default labels
      const threadDefaultLabels = thread.labels.filter(label =>
        defaultLabels.includes(label.name)
      );
      thread.labels = [...threadDefaultLabels, ...req.body.labels];
    }

    if (req.body.senderUnread === false) {
      const lastMessageReceived = (
        await req.nylas.messages.list({
          thread_id: thread.id,
          received_after: thread.lastMessageReceivedTimestamp - 1,
          limit: 1
        })
      )[0];
      const fromEmailAddress = lastMessageReceived.from[0].email;
      const unreadThreads = await req.nylas.threads.list({
        in: "inbox",
        from: fromEmailAddress,
        unread: true
      });

      await Promise.all(
        unreadThreads.map(thread => {
          thread.unread = false;
          return thread.save();
        })
      );
    }

    await thread.save();

    res.status(200).json(await getThreadById(req.nylas, id));
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Something went wrong. Please try again." });
  }
}

async function getThreadById(nylas, id) {
  const thread = await nylas.threads.find(id);
  const lastMessageReceived = (
    await nylas.messages.list({
      thread_id: thread.id,
      received_after: thread.lastMessageReceivedTimestamp - 1,
      limit: 1
    })
  )[0];

  const fromEmailAddress = lastMessageReceived.from[0].email;
  const senderUnreadCount = await nylas.messages.count({
    in: "inbox",
    from: fromEmailAddress,
    unread: true,
    limit: 1
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
    id: thread.id,
    subject: thread.subject,
    fromName: lastMessageReceived.from[0].name,
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
