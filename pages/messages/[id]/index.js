import { useState } from "react";
import fetch from "isomorphic-unfetch";
import Head from "next/head";
import Link from "next/link";
import InboxContainer from "../../../components/InboxContainer";
import Header from "../../../components/Header";
import Sidebar from "../../../components/Sidebar";
import Button from "../../../components/Button";
import Main from "../../../components/Main";
import List from "../../../components/MessageList";
import styles from "./id.module.css";
import calendarIcon from "../../../assets/calendar.svg";
import checkIcon from "../../../assets/check.svg";
import flagIcon from "../../../assets/flag.svg";
import doubleFlagIcon from "../../../assets/double_flag.svg";
import chevronLeftIcon from "../../../assets/chevron_left.svg";
import chevronRightIcon from "../../../assets/chevron_right.svg";
import checkboxUncheckedIcon from "../../../assets/checkbox_unchecked.svg";
import checkboxCheckedIcon from "../../../assets/checkbox_checked.svg";
import withAuth from "../../../utils/withAuth";
import classnames from "classnames";
import Frame, { FrameContextConsumer } from "react-frame-component";

export const getServerSideProps = withAuth(async context => {
  const thread = await (
    await fetch(`http://localhost:3000/api/messages/${context.query.id}`, {
      headers: context.req ? { cookie: context.req.headers.cookie } : undefined
    })
  ).json();

  return {
    props: {
      account: context.account,
      thread
    }
  };
});

export default function detailsPage({ account, thread }) {
  const activeIndex = thread.messages.findIndex(
    ({ active }) => active === true
  );
  const message = thread.messages[activeIndex];
  const prevMessages = thread.messages.slice(0, activeIndex + 1);
  const nextMessages = thread.messages.slice(activeIndex + 1);
  const showToDoList = account.organizationUnit === "label";

  const [iframeHeight, setIframeHeight] = useState(500);
  const [isUnread, setIsUnread] = useState(thread.unread);
  const [isSenderUnread, setIsSenderUnread] = useState(thread.senderUnread);

  async function markAsRead() {
    try {
      await fetch(`http://localhost:3000/api/messages/${message.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ unread: false })
      });

      setIsUnread(false);
    } catch (e) {
      alert("Something went wrong");
    }
  }

  async function markSenderAsRead() {
    try {
      await fetch(`http://localhost:3000/api/messages/${message.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ senderUnread: false })
      });

      setIsUnread(false);
      setIsSenderUnread(false);
    } catch (e) {
      alert("Something went wrong");
    }
  }

  return (
    <InboxContainer>
      <Head>
        <title>{message.subject} - Inbox Zero</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <Header account={account} />
      <Sidebar>
        <Link href="/">
          <a className={styles.BackButton}>
            <img
              src={chevronLeftIcon}
              alt="Back"
              className={styles.BackButton__icon}
            />{" "}
            <span>Back</span>
          </a>
        </Link>
        <Button>Reply</Button>
        <ul className={styles.Actions}>
          <li className={styles.Action}>
            <button className={styles.Action__button}>
              <span className={styles.Action__icon}>
                <img src={calendarIcon} />
              </span>
              <span>Schedule Meeting »</span>
            </button>
          </li>
          {showToDoList ? (
            <li className={styles.Action}>
              <button className={styles.Action__button}>
                <span className={styles.Action__icon}>
                  <img src={checkIcon} />
                </span>
                <span>Add to ToDo List »</span>
              </button>
            </li>
          ) : (
            ""
          )}
          <li>
            <ul className={styles.Labels}>
              {account.labels.map(({ id, displayName }) => (
                <li className={styles.Label}>
                  <button className={styles.Label__button}>
                    <span className={styles.Label__icon}>
                      <img src={checkboxCheckedIcon} />
                    </span>
                    <span>{displayName}</span>
                  </button>
                </li>
              ))}
            </ul>
          </li>
          <li
            className={classnames(styles.Action, {
              [styles.disabled]: isUnread === false
            })}
          >
            <button
              className={styles.Action__button}
              onClick={markAsRead}
              disabled={isUnread === false}
            >
              <span className={styles.Action__icon}>
                <img src={flagIcon} />
              </span>
              <span>Mark as Read »</span>
            </button>
          </li>
          <li
            className={classnames(styles.Action, {
              [styles.disabled]: isSenderUnread === false
            })}
          >
            <button
              className={styles.Action__button}
              onClick={markSenderAsRead}
              disabled={isSenderUnread === false}
            >
              <span className={styles.Action__icon}>
                <img src={doubleFlagIcon} />
              </span>
              <span>Mark All Emails From Sender as Read »</span>
            </button>
          </li>
        </ul>
      </Sidebar>
      <Main>
        <h2
          className={classnames(styles.Subject, {
            [styles.disabled]: isUnread === false
          })}
        >
          {message.subject}
        </h2>
        <List>
          {prevMessages.map(message => (
            <List.Message
              id={message.id}
              active={message.active}
              fromName={message.from[0].name}
              fromEmailAddress={message.from[0].email}
              date={message.date}
              hasAttachments={message.hasAttachments}
            />
          ))}
        </List>
        <div className={styles.Contents}>
          <Frame
            style={{
              width: "100%",
              border: 0,
              height: `${iframeHeight}px`
            }}
            initialContent={message.body}
          >
            <FrameContextConsumer>
              {({ document, window }) => {
                if (iframeHeight === 500) {
                  setTimeout(
                    () =>
                      setIframeHeight(
                        window.document.documentElement.scrollHeight
                      ),
                    1000
                  );
                }
              }}
            </FrameContextConsumer>
          </Frame>
          {message.hasAttachments && (
            <div className={styles.AttachmentWrapper}>
              {message.files.map(file => (
                <a
                  href={`/api/files/${file.filename}?id=${file.id}`}
                  className={styles.Attachment}
                  download
                >
                  {file.filename}
                </a>
              ))}
            </div>
          )}
        </div>
        <List divideTop={true}>
          {nextMessages.map(message => (
            <List.Message
              id={message.id}
              active={message.active}
              fromName={message.from[0].name}
              fromEmailAddress={message.from[0].email}
              date={message.date}
              hasAttachments={message.hasAttachments}
            />
          ))}
        </List>
      </Main>
    </InboxContainer>
  );
}
