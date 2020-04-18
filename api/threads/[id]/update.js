const Promise = require("bluebird");
const { DEFAULT_LABELS } = require("../../utils/constants");
const getThreadFrom = require("../../utils/getThreadFrom");

/**
 * Description: Updates an email thread. Updates include: mark thread
 *              as read, mark sender as read, and update labels
 * Endpoint:    PUT /api/threads/:id
 * Request:
 * {
 *   unread: Boolean,
 *   senderUnread: Boolean,
 *   labels: [
 *     {
 *       id: String,
 *       displayName: String,
 *       checked: Boolean
 *     }
 *   ]
 * }
 * Response:    {}
 */
module.exports = async (req, res) => {
  try {
    const id = req.params.id;
    const thread = await req.nylas.threads.find(id, null, { view: "expanded" });

    /** mark thread as read */
    if (req.body.unread === false) {
      thread.unread = false;
    }

    /** update labels */
    if (req.body.labels) {
      // replace all but the default labels
      const threadDefaultLabels = thread.labels.filter(label =>
        DEFAULT_LABELS.includes(label.name)
      );
      thread.labels = [
        ...threadDefaultLabels,
        ...req.body.labels.filter(label => label.checked)
      ];
    }

    await thread.save();

    /** mark sender as read */
    if (req.body.senderUnread === false) {
      await markSenderAsRead({
        nylas: req.nylas,
        thread,
        account: req.account
      });
    }

    res.status(200).json({});
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Failed to update thread." });
  }
};

async function markSenderAsRead({ nylas, thread, account }) {
  const fromEmailAddress = getThreadFrom(thread).email;
  const unreadThreads = await nylas.threads.list({
    in: "inbox",
    from: fromEmailAddress,
    unread: true
  });

  return Promise.map(
    unreadThreads,
    thread => {
      thread.unread = false;
      return thread.save();
    },
    { concurrency: 5 }
  );
  // limit to 5 calls at a time to stay under the rate limit
}
