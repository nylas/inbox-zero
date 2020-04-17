module.exports = async (req, res) => {
  try {
    const id = req.query.id;

    if (!id) {
      return res.status(404);
    }

    await req.nylas.files.delete(id);

    res.json({});
  } catch (err) {
    console.log(err);
    res.status(400).json({
      error: "Unable to delete file"
    });
  }
};
