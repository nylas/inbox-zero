import { Fragment, useState } from "react";
import Router from "next/router";
import Head from "next/head";
import styles from "./index.module.css";
import Layout, { Header, Content, Sidebar } from "../../layouts/Inbox";
import Button from "../../components/Button";
import Input from "../../components/Input";
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

  return {
    props: {
      account: context.account,
      page
    }
  };
});

export default function InboxPage({ account }) {
  const isInboxEmpty = 0;

  return (
    <Layout>
      <Head>
        <title>
          Inbox ({account.unreadCount}) - {account.emailAddress}
        </title>
      </Head>
      <Header account={account} />
      <Sidebar></Sidebar>
      <Content></Content>
    </Layout>
  );
}

function EmptyState() {
  return <img src={completeIcon} alt="Inbox zero achieved!" />;
}
