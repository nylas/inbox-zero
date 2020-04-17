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

module.exports = async (req, res) => {
  try {
    const id = req.params.id;
    const thread = await req.nylas.threads.find(id, null, { view: "expanded" });

    if (req.body.unread === false) {
      thread.unread = false;
    }

    if (req.body.labels) {
      // replace all but the default labels
      const threadDefaultLabels = thread.labels.filter(label =>
        defaultLabels.includes(label.name)
      );
      thread.labels = [
        ...threadDefaultLabels,
        ...req.body.labels.filter(label => label.checked)
      ];
    }

    if (req.body.senderUnread === false) {
      const firstMessageReceived =
        thread.messages.find(message => {
          return message.from[0].email !== req.account.emailAddress;
        }) || thread.messages[0];
      const fromEmailAddress = firstMessageReceived.from[0].email;
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

    res.status(200).json({});
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Something went wrong. Please try again." });
  }
};
