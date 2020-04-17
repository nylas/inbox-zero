module.exports = async (req, res) => {
  try {
    const id = req.query.id;

    if (!id) {
      return res.status(404);
    }

    const file = await req.nylas.files.find(id);
    const fileData = await file.download();

    res.send(fileData.body);
  } catch (err) {
    if (err.message.startsWith("Invalid id")) {
      return res.status(404).end();
    }

    console.log(err);
    res.status(500).end();
  }
};
