import { Fragment, useState } from "react";
import Router from "next/router";
import Head from "next/head";
import styles from "./index.module.css";
import Layout, { Header, Content, Sidebar } from "../../layouts/Inbox";
import Button from "../../components/Button";
import Threads, { Thread } from "../../components/Threads";
import Input from "../../components/Input";
import Pagination from "../../components/Pagination";
import completeIcon from "../../assets/complete.svg";
import request from "../../utils/request";
import redirect from "../../utils/redirect";
import withAuth from "../../utils/withAuth";

export const getServerSideProps = withAuth(async context => {
  const page = parseInt(context.query.page) || 1;
  const search = context.query.search || "";

  if (page < 1) {
    return redirect("/", { context });
  }

  const { hasNext, hasPrevious, threads } = await request(
    `/threads?page=${page}&search=${search}`,
    {
      context
    }
  );

  // redirect home if we are on a page that doesn't have any threads
  if (threads.length === 0 && page > 1) {
    return redirect("/", { context });
  }

  return {
    props: {
      account: context.account,
      page,
      search,
      threads,
      hasNext,
      hasPrevious
    }
  };
});

export default function InboxPage({
  account,
  page,
  search,
  threads,
  hasNext,
  hasPrevious
}) {
  const isInboxEmpty = threads.length === 0;
  const maybeSearch = search.length > 0 ? `&search=${search}` : "";
  const previousLink = hasPrevious ? `/?page=${page - 1}${maybeSearch}` : null;
  const nextLink = hasNext ? `/?page=${page + 1}${maybeSearch}` : null;

  return (
    <Layout>
      <Head>
        <title>
          Inbox ({account.unreadCount}) - {account.emailAddress}
        </title>
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
        <SearchForm search={search} />
      </Sidebar>
      <Content>
        {isInboxEmpty ? (
          <EmptyState />
        ) : (
          <Fragment>
            <Threads>
              {threads.map(thread => (
                <Thread
                  key={thread.id}
                  id={thread.id}
                  unread={thread.unread}
                  fromName={thread.from.name}
                  subject={thread.subject}
                  snippet={thread.snippet}
                  date={thread.date}
                  hasAttachment={thread.hasAttachments}
                />
              ))}
            </Threads>
            <Pagination
              label={`Page ${page}`}
              previous={previousLink ? { href: previousLink } : null}
              next={nextLink ? { href: nextLink } : null}
            />
          </Fragment>
        )}
      </Content>
    </Layout>
  );
}

function SearchForm({ search }) {
  const [searchInput, setSearchInput] = useState(search);

  return (
    <form
      onSubmit={event => {
        event.preventDefault();
        Router.push(`/?search=${encodeURIComponent(searchInput)}`);
      }}
      className={styles.SearchForm}
    >
      <Input
        placeholder={"Search"}
        value={searchInput}
        onChange={({ target }) => setSearchInput(target.value)}
        type="search"
      />
    </form>
  );
}

function EmptyState() {
  return <img src={completeIcon} alt="Inbox zero achieved!" />;
}
