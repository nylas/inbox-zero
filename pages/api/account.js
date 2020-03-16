import protect from "../../utils/middleware/protect";

/**
 * Retrieves a list of messages that belong to the current user which
 * match the given parameters.
 */
export default protect(async (req, res) => {
  try {
    const unreadCount = await req.nylas.messages.count({ unread: true });

    res.status(200).json({
      name: req.account.name,
      email: req.account.email,
      unreadCount: unreadCount
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Something went wrong. Please try again." });
  }
});
