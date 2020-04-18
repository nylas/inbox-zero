/**
 * Utility to redirect from both the server and client
 */
export default function redirect(location, { context } = {}) {
  if (context) {
    context.res.redirect(location);
  } else {
    window.location.href = location;
  }
}
