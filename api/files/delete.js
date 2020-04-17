/**
 * Description: Deletes a file by ID
 * Endpoint:    DELETE /api/files/:name?id=:id
 * Response:    {}
 */
module.exports = async (req, res) => {
  try {
    const id = req.query.id;

    if (!id) {
      return res.status(404).json({ error: "File not found." });
    }

    await req.nylas.files.delete(id);

    res.json({});
  } catch (error) {
    if (error.statusCode === 404) {
      return res.status(404).json({ error: "File not found." });
    }

    console.log(error);
    return res.status(500).json({
      error: "Failed to delete file."
    });
  }
};
