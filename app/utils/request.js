import fetch from "isomorphic-unfetch";

/**
 * A simple wrapper for API requests
 */
export default async function request(
  endpoint,
  { body, context, ...customConfig } = {}
) {
  const headers = {
    "content-type": "application/json"
  };

  const config = {
    method: body ? "POST" : "GET",
    ...customConfig,
    headers: {
      ...headers,
      ...(context ? context.req.headers : {}), // inherit headers from req on server
      ...customConfig.headers
    }
  };
  if (body) {
    config.body = JSON.stringify(body);
  }

  const url = endpoint.startsWith("http")
    ? endpoint
    : `${getOrigin(context)}/api/${endpoint}`;
  const response = await fetch(url, config);
  const data = await response.json();
  if (response.ok) {
    return data;
  } else {
    return Promise.reject(data);
  }
}

/**
 * Gets the origin from the request if we are on the server,
 * or the window if we in the browser.
 */
function getOrigin(context) {
  if (context) {
    return context.req.protocol + "://" + context.req.get("host");
  } else {
    return window.location.origin;
  }
}
