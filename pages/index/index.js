import { Fragment, useState } from "react";
import Link from "next/link";
import Router from "next/router";
import client from "../../utils/client";
import redirect from "../../utils/redirect";
import Head from "next/head";
import Layout, { Header, Content, Sidebar } from "../../layouts/Inbox";
import Button from "../../components/Button";
import List from "../../components/ThreadList";
import chevronLeftIcon from "../../assets/chevron_left.svg";
import chevronRightIcon from "../../assets/chevron_right.svg";
import completeIcon from "../../assets/complete.svg";
import styles from "./index.module.css";
import withAuth from "../../utils/withAuth";
import classnames from "classnames";
import Input from "../../components/Input";

export const getServerSideProps = withAuth(async context => {
  const currentPage = parseInt(context.query.page) || 1;
  const search = context.query.search || "";
  const threads = await client(
    `/threads?page=${currentPage}&search=${search}`,
    { context }
  );

  // redirect home if we are on a page that doesn't have any threads
  if (threads.length === 0 && currentPage > 1) {
    redirect("/", { context });
  }

  return {
    props: {
      account: context.account,
      currentPage,
      currentSearch: search,
      threads
    }
  };
});

export default function Inbox(props) {
  const account = props.account;
  const isInboxEmpty = props.threads.length === 0;
  const [search, setSearch] = useState(props.currentSearch);

  return (
    <Layout>
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
        <Button href="/" variant="primary">
          Refresh
        </Button>
        <form
          onSubmit={event => {
            event.preventDefault();
            Router.push(`/?search=${encodeURIComponent(search)}`);
          }}
          className={styles.SearchForm}
        >
          <Input
            placeholder={"Search"}
            value={search}
            onChange={({ target }) => setSearch(target.value)}
            type="search"
          />
        </form>
      </Sidebar>
      <Content>
        {isInboxEmpty ? <EmptyState /> : <Threads {...props} />}
      </Content>
    </Layout>
  );
}

function EmptyState() {
  return <img src={completeIcon} alt="Inbox zero achieved!" />;
}

function Threads({ account, threads, currentPage, currentSearch }) {
  const previousPage = currentPage > 1 ? currentPage - 1 : 1;
  const nextPage = currentPage + 1;
  const maybeSearch =
    currentSearch.length > 0 ? `&search=${currentSearch}` : "";

  return (
    <Fragment>
      <List>
        {threads.map(thread => (
          <List.Thread
            id={thread.id}
            unread={thread.unread}
            fromName={thread.from.name}
            subject={thread.subject}
            snippet={thread.snippet}
            date={thread.date}
            hasAttachment={thread.hasAttachments}
          />
        ))}
      </List>
      <div className={styles.Pagination}>
        <button
          className={styles.Pagination__button}
          disabled={currentPage <= 1}
          onClick={() =>
            Router.push(`/`, `/?page=${previousPage}${maybeSearch}`)
          }
        >
          <img src={chevronLeftIcon} alt="previous" />
        </button>
        <div>Page {currentPage}</div>
        <button
          className={styles.Pagination__button}
          disabled={threads.length < 6}
          onClick={() => Router.push(`/`, `/?page=${nextPage}${maybeSearch}`)}
        >
          <img src={chevronRightIcon} alt="next" />
        </button>
      </div>
    </Fragment>
  );
}
