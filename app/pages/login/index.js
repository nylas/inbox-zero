import { useState } from "react";
import Head from "next/head";
import Layout from "../../layouts/Public";
import Input from "../../components/Input";
import Button from "../../components/Button";
import redirect from "../../utils/redirect";
import styles from "./login.module.css";

export function getServerSideProps(context) {
  if (context.req.cookies.token) {
    redirect("/", { context });
  }

  return {
    props: {
      message: context.query.message || null
    }
  };
}

export default function LoginPage({ message }) {
  const [email, setEmail] = useState("");

  const handleSubmit = event => {
    event.preventDefault();
    redirect(`/api/login?loginHint=${email}`);
  };

  return (
    <Layout>
      <Head>
        <title>Inbox Zero | Login</title>
      </Head>
      <form onSubmit={handleSubmit}>
        <h1 className={styles.Title}>Login</h1>
        <div className={styles.InputWrapper}>
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
