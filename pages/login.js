import Head from "next/head";
import LoginContainer from "../components/LoginContainer";
import Input from "../components/Input";
import Button from "../components/Button";

function HomePage() {

  return (
    <LoginContainer>
      <Head>
        <title>Inbox (100) - avigoldmankid@gmail.com</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <h1 style={{ fontSize: 60 }}>Login</h1>
      <div style={{ margin: '40px 0' }}>
        <Input type="email" placeholder="Email address" autoFocus />
      </div>
      <Button>Login</Button>
    </LoginContainer>
  );
}

export default HomePage;
