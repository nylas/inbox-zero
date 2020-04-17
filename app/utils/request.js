import fetch from "isomorphic-unfetch";

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
    : `${process.env.API_URL}${endpoint}`;
  const response = await fetch(url, config);
  const data = await response.json();
  if (response.ok) {
    return data;
  } else {
    return Promise.reject(data);
  }
}
