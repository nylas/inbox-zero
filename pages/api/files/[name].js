import protect from "../../../middleware/protect";
/**
 * Retrieves a list of messages that belong to the current user which
 * match the given parameters.
 */
export default protect(async (req, res) => {
  if (req.method === "GET") {
    return downloadFileRequest(req, res);
  }
  if (req.method === "DELETE") {
    return deleteFileRequest(req, res);
  } else {
    res.status(405).end();
  }
});

async function downloadFileRequest(req, res) {
  try {
    const id = req.query.id;

    if (!id) {
      return res.status(404).end();
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
}

async function deleteFileRequest(req, res) {
  try {
    const id = req.query.name;
    await req.nylas.files.delete(id);

    res.json({});
  } catch (err) {
    console.log(err);
    res.status(400).json({
      error: "Unable to delete file"
    });
  }
}
