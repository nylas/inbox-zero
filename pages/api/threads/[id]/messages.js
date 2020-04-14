import protect from "../../../../middleware/protect";

/**
 * Retrieves a list of messages that belong to the current user which
 * match the given parameters.
 */
export default protect(async (req, res) => {
  const id = req.query.id;
  const messages = await req.nylas.messages.list({
    thread_id: id,
    view: "expanded"
  });

  res.json(messages.map(simplifyMessage));
});

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
