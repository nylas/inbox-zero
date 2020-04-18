/**
 * Standard categories labels that we don't want to show in the app
 * or modify when we add/remove other labels
 *
 * Learn more: https://docs.nylas.com/reference#labels
 */
const DEFAULT_LABELS = [
  "inbox",
  "all",
  "trash",
  "archive",
  "drafts",
  "sent",
  "spam",
  "important"
];

const PAGE_LIMIT = 6;

module.exports = { DEFAULT_LABELS, PAGE_LIMIT };
