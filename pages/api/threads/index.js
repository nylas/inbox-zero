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

    let threads = await (search.length > 0
      ? req.nylas.threads.search(search, { ...pagination })
      : req.nylas.threads.list(
          {
            in: "inbox",
            unread: true,
            view: "expanded",
            ...pagination
          },
          null
        ));

    if (search.length > 0) {
      threads = await Promise.all(
        threads.map(async thread => {
          const messages = await req.nylas.messages.list({
            thread_id: thread.id
          });

          thread.messages = messages;

          return thread;
        })
      );
    }

    threads = threads.map(thread => {
      const firstMessageReceived =
        thread.messages.find(message => {
          return message.from[0].email !== req.account.emailAddress;
        }) || thread.messages[0];

      thread.firstMessageReceived = firstMessageReceived;
      return thread;
    });

    // get the first item on the next page
    const hasNext =
      (
        await (search.length > 0
          ? req.nylas.threads.search(search, {
              limit: 1,
              offset: page * limit
            })
          : req.nylas.threads.list({
              in: "inbox",
              unread: true,
              limit: 1,
              offset: page * limit
            }))
      ).length > 0;

    res.status(200).json({
      hasPrevious: page > 1,
      hasNext,
      threads: threads.map(simplifyThread)
    });
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
      name: thread.firstMessageReceived.from[0].name,
      email: thread.firstMessageReceived.from[0].email
    },
    date: thread.lastMessageTimestamp,
    snippet: thread.snippet,
    unread: thread.unread,
    hasAttachments: thread.hasAttachments
  };
}
