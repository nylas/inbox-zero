import { Fragment } from "react";
import Link from "next/link";
import fetch from "isomorphic-unfetch";
import Head from "next/head";
import InboxContainer from "../../components/InboxContainer";
import Header from "../../components/Header";
import Button from "../../components/Button";
import Sidebar from "../../components/Sidebar";
import Main from "../../components/Main";
import List from "../../components/ThreadList";
import chevronLeftIcon from "../../assets/chevron_left.svg";
import chevronRightIcon from "../../assets/chevron_right.svg";
import completeIcon from "../../assets/complete.svg";
import styles from "./index.module.css";
import withAuth from "../../utils/withAuth";
import classnames from "classnames";

function EmptyState() {
  return <img src={completeIcon} alt="Inbox zero achieved!" />;
}

function MessageList({ messages, currentPage }) {
  return (
    <Fragment>
      <List>
        {messages.map(message => (
          <List.Thread
            id={message.id}
            unread={message.unread}
            fromName={message.from[0].name}
            subject={message.subject}
            snippet={message.snippet}
            date={message.date}
            hasAttachment={message.hasAttachments}
          />
        ))}
      </List>
      <div className={styles.Pagination}>
        <Link href={`/?page=${currentPage - 1}`}>
          <a className={classnames(styles.Pagination__button, styles.disabled)}>
            <img src={chevronLeftIcon} alt="previous" />
          </a>
        </Link>
        <div>Page {currentPage}</div>
        <Link href={`/?page=${currentPage + 1}`}>
          <a className={classnames(styles.Pagination__button)}>
            <img src={chevronRightIcon} alt="next" />
          </a>
        </Link>
      </div>
    </Fragment>
  );
}

export const getServerSideProps = withAuth(async context => {
  const currentPage = parseInt(context.query.page) || 1;
  const messages = await (
    await fetch(`http://localhost:3000/api/messages?page=${currentPage}`, {
      headers: context.req ? { cookie: context.req.headers.cookie } : undefined
    })
  ).json();

  return {
    props: {
      account: context.account,
      currentPage,
      messages
    }
  };
});

export default function Inbox({ account, messages, currentPage }) {
  return (
    <InboxContainer>
      <Head>
        <title>
          Inbox ({account.unreadCount}) - {account.emailAddress}
        </title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <Header account={account} />
      <Sidebar>
        <p className={styles.InboxOverview}>
          <span className={styles.UnreadCount}>
            {account.unreadCount.toLocaleString()}
          </span>
          <br />
          unread emails
          {/* <br />from{" "}<span className={styles.SenderCount}>
          {account.senderCount.toLocaleString()}
        </span>{" "}<br />
        senders.*/}
        </p>
        <Button variant="primary">Refresh</Button>
      </Sidebar>
      <Main>
        {messages.length === 0 ? (
          <EmptyState />
        ) : (
          <MessageList messages={messages} currentPage={currentPage} />
        )}
      </Main>
    </InboxContainer>
  );
}
