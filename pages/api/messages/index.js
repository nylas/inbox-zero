import protect from "../../../utils/middleware/protect";

/**
 * Retrieves a list of messages that belong to the current user which
 * match the given parameters.
 */
export default protect(async (req, res) => {
  try {
    const page = req.query.page >= 1 ? req.query.page : 1;
    const limit = 6;

    const messages = await req.nylas.messages.list({
      in: "inbox",
      unread: true,
      limit: limit,
      offset: (page - 1) * limit
    });

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
    hasAttachments: message.hasAttachments
  };
}
