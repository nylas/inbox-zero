import { useState } from "react";
import Head from "next/head";
import LoginContainer from "../components/LoginContainer";
import Input from "../components/Input";
import Button from "../components/Button";

export default function LoginPage() {
  const [email, setEmail] = useState("");

  return (
    <LoginContainer>
      <Head>
        <title>Inbox (100) - avigoldmankid@gmail.com</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <form
        onSubmit={() => {
          window.location.assign(`
            https://api.nylas.com/oauth/authorize?login_hint=${email}&client_id=${process.env.NYLAS_ID}&response_type=code&redirect_uri=http://localhost:3000/api/authorize&scopes=email.send,email.read_only
          `);
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
            required
          />
        </div>
        <Button>Login</Button>
      </form>
    </LoginContainer>
  );
}
