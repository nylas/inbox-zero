import protect from "../../../middleware/protect";

/**
 * Retrieves a list of threads that belong to the current user which
 * match the given parameters.
 */
export default protect(async (req, res) => {
  try {
    const page = req.query.page >= 1 ? req.query.page : 1;
    const search = req.query.search || "";
    const limit = 6;

    const pagination = {
      limit: limit,
      offset: (page - 1) * limit
    };

    const threads = await (search.length > 0
      ? req.nylas.threads.search(search, { ...pagination })
      : await req.nylas.threads.list({
          in: "inbox",
          unread: true,
          ...pagination
        }));

    const expandedThreads = await Promise.all(
      threads.map(async thread => {
        const lastMessageReceived = await req.nylas.messages.list({
          thread_id: thread.id,
          received_after: thread.lastMessageReceivedTimestamp - 1,
          limit: 1
        });

        thread.lastMessageReceived = lastMessageReceived.length
          ? lastMessageReceived[0]
          : "";

        return thread;
      })
    );

    res.status(200).json(expandedThreads.map(simplifyThread));
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Something went wrong. Please try again." });
  }
});

function simplifyThread(thread) {
  return {
    id: thread.id,
    subject: thread.subject,
    from: {
      name: thread.lastMessageReceived.from[0].name,
      email: thread.lastMessageReceived.from[0].email
    },
    date: thread.lastMessageTimestamp,
    snippet: thread.snippet,
    unread: thread.unread,
    hasAttachments: thread.hasAttachments
  };
}
