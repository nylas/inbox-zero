import protect from "../../utils/middleware/protect";

export default protect(async (req, res) => {
  const displayName = req.body.displayName;

  if (!displayName) {
    return res.status(400).json({ error: "displayName is required" });
  }

  const label = req.nylas.labels.build();
  label.displayName = displayName;
  await label.save();

  res.json({
    id: label.id,
    displayName: label.displayName,
    checked: false
  });
});
