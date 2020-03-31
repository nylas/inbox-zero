import { Fragment, useState } from "react";
import Link from "next/link";
import Router from "next/router";
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
import Input from "../../components/Input";

function EmptyState() {
  return <img src={completeIcon} alt="Inbox zero achieved!" />;
}

function MessageList({ messages, currentPage, currentSearch }) {
  const previousPage = currentPage > 1 ? currentPage - 1 : 1
  const nextPage = currentPage + 1
  const maybeSearch = currentSearch.length > 0 ? `&search=${currentSearch}` : ''

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
        <Link href={`/?page=${previousPage}${maybeSearch}`}>
          <a className={classnames(styles.Pagination__button, { [styles.disabled]: currentPage <= 1 })}>
            <img src={chevronLeftIcon} alt="previous" />
          </a>
        </Link>
        <div>Page {currentPage}</div>
        <Link href={`/?page=${nextPage}${maybeSearch}`}>
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
  const search = context.query.search || '';
  const messages = await (
    await fetch(`http://localhost:3000/api/messages?page=${currentPage}&search=${search}`, {
      headers: context.req ? { cookie: context.req.headers.cookie } : undefined
    })
  ).json();

  return {
    props: {
      account: context.account,
      currentPage,
      currentSearch: search,
      messages
    }
  };
});

export default function Inbox({ account, messages, currentPage, currentSearch }) {
  const [search, setSearch] = useState(currentSearch);

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
          <span className={styles.InboxOverview__UnreadCount}>
            {account.unreadCount.toLocaleString()}
          </span>
          <br />
          unread emails
        </p>
        <Button href="/" variant="primary">Refresh</Button>
        <form onSubmit={(event) => {
          event.preventDefault()
          Router.push(`/?search=${encodeURIComponent(search)}`)
        }} className={styles.SearchForm}>
          <Input placeholder={'Search'} value={search} onChange={({ target }) => setSearch(target.value)} type="search" />
        </form>
      </Sidebar>
      <Main>
        {messages.length === 0 ? (
          <EmptyState />
        ) : (
          <MessageList messages={messages} currentPage={currentPage} currentSearch={currentSearch} />
        )}
      </Main>
    </InboxContainer>
  );
}
