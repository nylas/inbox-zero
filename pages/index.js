import Head from "next/head";
import InboxContainer from "../components/InboxContainer";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import Main from "../components/Main";
import List from "../components/MessageList";
import Pagination from "../components/Pagination";

function HomePage() {

  return (
    <InboxContainer>
      <Head>
        <title>Inbox (100) - avigoldmankid@gmail.com</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <Header />
      <Sidebar />
      <Main>
        <List>
          <List.Message
            status="unread"
            fromName="Ben Pearson"
            subject="Check out this cool subject line!"
            preview="I’m typing out a snipppet line I’m typing out a snipppet line I’m typing out a snipppet line "
            date={1557950729}
            hasAttachment={false}
          />
          <List.Message
            status="unread"
            fromName="Matt Harper"
            subject="Check out this cool subject line!"
            preview="I’m typing out a snipppet line I’m typing out a snipppet line I’m typing out a snipppet line "
            date={1557950729}
            hasAttachment={true}
          />
          <List.Message
            status="read"
            fromName="Tasia Potasinski"
            subject="Check out this cool subject line!"
            preview="I’m typing out a snipppet line I’m typing out a snipppet line I’m typing out a snipppet line "
            date={1557950729}
            hasAttachment={false}
          />
          <List.Message
            status="unread"
            fromName="Cecilia Tao"
            subject="Check out this cool subject line!"
            preview="I’m typing out a snipppet line I’m typing out a snipppet line I’m typing out a snipppet line "
            date={1557950729}
            hasAttachment={false}
          />
          <List.Message
            status="read"
            fromName="Matt Harper"
            subject="Check out this cool subject line!"
            preview="I’m typing out a snipppet line I’m typing out a snipppet line I’m typing out a snipppet line "
            date={1557950729}
            hasAttachment={true}
          />
          <List.Message
            status="read"
            fromName="Ben Pearson"
            subject="Check out this cool subject line!"
            preview="I’m typing out a snipppet line I’m typing out a snipppet line I’m typing out a snipppet line "
            date={1557950729}
            hasAttachment={true}
          />
        </List>
        <Pagination />
      </Main>
    </InboxContainer>
  );
}

export default HomePage;
