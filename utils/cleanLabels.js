const defaultLabels = [
  "inbox",
  "all",
  "trash",
  "archive",
  "drafts",
  "sent",
  "spam",
  "important"
];

export default function cleanLabels(labels) {
  return labels
    .filter(label => !defaultLabels.includes(label.name))
    .map(label => {
      return {
        id: label.id,
        displayName: label.displayName
      };
    });
}
