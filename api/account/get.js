/**
 * Description: Retrieves information about the authenticated account.
 * Endpoint:    GET /api/account
 * Response:
 * {
 *   name: String,
 *   emailAddress: String,
 *   organizationUnit: Enum('label', 'folder'),
 *   unreadCount: Number,
 *   accessToken: String
 * }
 */
module.exports = async (req, res) => {
  try {
    res.status(200).json({
      name: req.account.name,
      emailAddress: req.account.emailAddress,
      organizationUnit: req.account.organizationUnit,
      accessToken: req.account.accessToken
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Failed to fetch account." });
  }
};
