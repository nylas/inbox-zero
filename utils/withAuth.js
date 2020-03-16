import fetch from "isomorphic-unfetch";

export default function withAuth(handler = () => {
  return {
    props: {}
  }
}) {
  return async function getServerSideProps(context, ...restArgs) {
    const account = await (
      await fetch(`http://localhost:3000/api/account`, {
        headers: context.req ? { cookie: context.req.headers.cookie } : undefined
      })
    ).json();

    // if our authentication failed, then log the user out
    if (account.error === 'Unauthorized') {
      if (context.req) {
        context.res.writeHead(302, { Location: '/api/revoke' })
        return context.res.end()
      } else {
        return document.location.pathname = '/api/revoke'
      }
    }

    context.account = account

    return handler(context, ...restArgs)
  }
}