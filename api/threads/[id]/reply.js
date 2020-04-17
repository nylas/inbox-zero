/**
 * Description: Reply to the last message in a thread and mark the
 *              thread as read.
 * Endpoint:    POST /api/threads/:id
 * Request:
 * {
 *   to:  [ { email: String } ],
 *   cc:  [ { email: String } ],
 *   bcc: [ { email: String } ],
 *   body: String
 * }
 * Response:    {}
 */
module.exports = async (req, res) => {
  const id = req.params.id;
  const thread = await req.nylas.threads.find(id);
  thread.unread = false;
  const draft = req.nylas.drafts.build();
  // Send replies by setting replyToMessageId for a draft
  draft.subject = thread.subject;
  draft.replyToMessageId = thread.messageIds[thread.messageIds.length - 1];
  draft.to = req.body.to;
  draft.cc = req.body.cc;
  draft.bcc = req.body.bcc;
  draft.body = req.body.body;
  draft.files = req.body.files;

  try {
    await draft.send();
    await thread.save();
    res.json({});
  } catch (error) {
    // pass through nylas errors
    if (error.statusCode) {
      return res.status(400).json({
        error: error.message
      });
    }

    res.status(500).json({
      error: "Failed to send reply."
    });
  }
};
