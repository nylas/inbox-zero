/**
 * Description: Creates a new label
 * Endpoint:    POST /api/labels
 * Request:
 * {
 *   displayName: String
 * }
 * Response:
 * {
 *   id: String,
 *   displayName: String,
 *   checked: false
 * }
 */
module.exports = async (req, res) => {
  try {
    const displayName = req.body.displayName;

    if (req.account.organizationUnit !== "label") {
      return res.status(400).json({
        error: "Labels are not supported."
      });
    }

    if (!displayName) {
      return res.status(400).json({ error: "displayName is required." });
    }

    const label = req.nylas.labels.build();
    label.displayName = displayName;
    await label.save();

    res.json({
      id: label.id,
      displayName: label.displayName,
      checked: false
    });
  } catch (error) {
    if (error.message.endsWith("already exists")) {
      return res.status(400).json({
        error: "Label already exists."
      });
    }

    res.status(500).json({
      error: "Failed to create label."
    });
  }
};
