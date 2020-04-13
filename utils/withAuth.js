import client from "./client";

export default function withAuth(
  handler = () => {
    return {
      props: {}
    };
  }
) {
  return async function getServerSideProps(context, ...restArgs) {
    try {
      const account = await client("/account", { context });

      context.account = account;
      return handler(context, ...restArgs);
    } catch (e) {
      // if our authentication failed, then log the user out
      if (context.req) {
        context.res.writeHead(302, { Location: "/api/revoke" });
        return context.res.end();
      } else {
        return (document.location.pathname = "/api/revoke");
      }
    }
  };
}
