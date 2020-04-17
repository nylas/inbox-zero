module.exports = async (req, res) => {
  const id = req.params.id;
  const thread = await req.nylas.threads.find(id);
  thread.unread = false;
  const draft = req.nylas.drafts.build();
  // Send replies by setting replyToMessageId for a draft
  draft.subject = thread.subject;
  draft.replyToMessageId = last(thread.messageIds);
  draft.to = req.body.to.map(email => {
    return { email };
  });
  draft.cc = req.body.cc.map(email => {
    return { email };
  });
  draft.bcc = req.body.bcc.map(email => {
    return { email };
  });
  draft.body = req.body.body;
  draft.files = req.body.files;

  try {
    await draft.send();
    await thread.save();
    res.json({});
  } catch (e) {
    res.status(400).json({
      error: e.message
    });
  }
};

function last(arr) {
  return arr[arr.length - 1];
}
