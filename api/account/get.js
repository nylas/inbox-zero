/**
 * Retrieves a list of messages that belong to the current user which
 * match the given parameters.
 */
module.exports = async (req, res) => {
  try {
    const unreadCount = await req.nylas.threads.count({
      in: "inbox",
      unread: true
    });

    res.status(200).json({
      name: req.account.name,
      emailAddress: req.account.emailAddress,
      organizationUnit: req.account.organizationUnit,
      unreadCount: unreadCount,
      accessToken: req.account.accessToken
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Something went wrong. Please try again." });
  }
};
