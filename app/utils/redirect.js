export default function redirect(location, { context } = {}) {
  if (context) {
    context.res.writeHead(302, { Location: location });
    return context.res.end();
  } else {
    return (window.location.href = location);
  }
}
