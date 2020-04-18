/**
 * Watches the given element and when it is removed from the dom,
 * runs the callback.
 *
 * This is used to refresh the "schedulerPages" list when the scheduler
 * modal is closed.
 */
export default function onRemove(element, callback) {
  const parent = element.parentNode;
  if (!parent) throw new Error("The node must already be attached");

  const obs = new MutationObserver(mutations => {
    for (const mutation of mutations) {
      for (const el of mutation.removedNodes) {
        if (el === element) {
          obs.disconnect();
          callback();
        }
      }
    }
  });
  obs.observe(parent, {
    childList: true
  });
}
