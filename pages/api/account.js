import protect from "../../utils/middleware/protect";
import cleanLabels from "../../utils/cleanLabels";

/**
 * Retrieves a list of messages that belong to the current user which
 * match the given parameters.
 */
export default protect(async (req, res) => {
  try {
    const unreadCount = await req.nylas.messages.count({
      in: "inbox",
      unread: true
    });

    const labels =
      req.account.organizationUnit === "label"
        ? cleanLabels(await req.nylas.labels.list())
        : [];

    res.status(200).json({
      name: req.account.name,
      emailAddress: req.account.emailAddress,
      organizationUnit: req.account.organizationUnit,
      unreadCount: unreadCount,
      labels
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Something went wrong. Please try again." });
  }
});
