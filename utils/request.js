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
      ...(context ? context.req.headers : {}) // inherit headers from req on server
    }
  };
  if (body) {
    config.body = JSON.stringify(body);
  }

  const response = await fetch(`${process.env.API_URL}${endpoint}`, config);
  const data = await response.json();
  if (response.ok) {
    return data;
  } else {
    return Promise.reject(data);
  }
}
