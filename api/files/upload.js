const { promises: fs } = require("fs");
const formidable = require("formidable");

module.exports = async (req, res) => {
  const form = formidable({ multiples: true });

  return form.parse(req, async (error, fields, files) => {
    if (error) {
      return res.status(400).json({
        error: "Failed to upload file"
      });
    }

    const upload = files.upload;

    if (!upload) {
      return res.status(400).json({
        error: "No file uploaded"
      });
    }

    const filename = upload.name;
    const data = await fs.readFile(upload.path);
    const contentType = upload.type;

    try {
      const file = req.nylas.files.build({
        filename,
        data,
        contentType
      });

      await file.upload();

      res.json({
        id: file.id,
        filename: file.filename
      });
    } catch (error) {
      res.status(400).json({
        error: "Failed to upload file to account"
      });
    }
  });
};
