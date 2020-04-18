import request from "./request";
import redirect from "./redirect";

/**
 * A wrapper function that ensures that the visitor is authenticated
 * when visiting a wrapped page, and adds their account information to
 * context.
 */
export default function withAuth(
  handler = () => {
    return {
      props: {}
    };
  }
) {
  return async function getServerSideProps(context, ...restArgs) {
    try {
      const account = await request("/account", { context });

      context.account = account;
      return handler(context, ...restArgs);
    } catch (e) {
      // if our authentication check failed, then log the user out
      redirect("/api/logout", { context });

      return { props: {} };
    }
  };
}
