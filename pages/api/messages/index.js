import protect from "../../../middleware/protect";

/**
 * Retrieves a list of messages that belong to the current user which
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

    const messages = await (search.length > 0
      ? req.nylas.messages.search(search, { ...pagination })
      : await req.nylas.messages.list({
          in: "inbox",
          unread: true,
          ...pagination
        }));

    res.status(200).json(messages.map(simplifyMessage));
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Something went wrong. Please try again." });
  }
});

function simplifyMessage(message) {
  return {
    id: message.id,
    subject: message.subject,
    from: message.from,
    date: message.date,
    snippet: message.snippet,
    unread: message.unread,
    hasAttachments: message.files.length > 0
  };
}
