import { useState } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import Layout from "../../layouts/Public";
import Input from "../../components/Input";
import Button from "../../components/Button";
import redirect from "../../utils/redirect";
import styles from "./login.module.css";
import cookie from "cookie";

export function getServerSideProps(context) {
  const cookies = cookie.parse(
    context.req ? context.req.headers.cookie : document.cookie
  );

  if (cookies.token) {
    redirect("/", { context });
  }

  return { props: {} };
}

export default function LoginPage() {
  const router = useRouter();
  const message = router.query.message;

  const [email, setEmail] = useState("");

  return (
    <Layout>
      <Head>
        <title>Inbox Zero | Login</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <form
        onSubmit={() => {
          window.location.assign(`/api/login?login_hint=${email}`);
          event.preventDefault();
        }}
      >
        <h1 style={{ fontSize: 60 }}>Login</h1>
        <div style={{ margin: "40px 0" }}>
          <Input
            type="email"
            placeholder="Email address"
            value={email}
            onChange={({ target }) => setEmail(target.value)}
            autoFocus
          />
        </div>
        <Button>Login</Button>
        {message ? <div className={styles.ErrorMessage}>{message}</div> : ""}
      </form>
    </Layout>
  );
}
