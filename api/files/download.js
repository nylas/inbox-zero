/**
 * Description: Downloads a file with the given name, found by the given ID
 * Endpoint:    GET /api/files/:name?id=:id
 * Response:    File Data
 */
module.exports = async (req, res) => {
  try {
    const id = req.query.id;

    if (!id) {
      return res.status(404).json({ error: "File not found." });
    }

    const file = await req.nylas.files.find(id);
    const fileData = await file.download();

    res.send(fileData.body);
  } catch (error) {
    if (error.statusCode === 404) {
      return res.status(404).json({ error: "File not found." });
    }

    console.log(error);
    return res.status(500).json({
      error: "Failed to download file."
    });
  }
};
