const { promises: fs } = require("fs");
const formidable = require("formidable");

/**
 * Description: Upload a file
 * Endpoint:    POST /api/files/
 * Request:     Form Data
 * Response:
 * {
 *   id: String,
 *   filename: String
 * }
 */
module.exports = async (req, res) => {
  const form = formidable({ multiples: true });

  return form.parse(req, async (error, fields, files) => {
    if (error) {
      return res.status(400).json({
        error: "Failed to parse file upload."
      });
    }

    const upload = files.upload;

    if (!upload) {
      return res.status(400).json({
        error: "No file uploaded."
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
      console.log(error);
      res.status(500).json({
        error: "Failed to upload file to email account."
      });
    }
  });
};
