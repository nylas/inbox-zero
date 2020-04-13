import client from "./client";
import redirect from "./redirect";

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
      // if our authentication check failed, then log the user out
      redirect("/api/logout", { context });
    }
  };
}
