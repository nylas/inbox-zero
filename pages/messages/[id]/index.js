import fetch from "isomorphic-unfetch";
import Head from "next/head";
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
import withAuth from "../../../utils/withAuth";
import classnames from "classnames"

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
  }
});

export default function detailsPage({ thread }) {
  const activeIndex = thread.messages.findIndex(({ active }) => active === true)
  const message = thread.messages[activeIndex]
  const prevMessages = thread.messages.slice(0, activeIndex+1)
  const nextMessages = thread.messages.slice(activeIndex+1)

  console.log(thread)
  return (
    <InboxContainer>
      <Header />
      <Sidebar>
        <Button>Reply</Button>
        <ul className={styles.Actions}>
          <li className={styles.Action}>
            <span className={styles.Actions__image}>
              <img src={calendarIcon} />
            </span>
            <span>Schedule Meeting »</span>
          </li>
          <li className={styles.Action}>
            <span className={styles.Actions__image}>
              <img src={checkIcon} />
            </span>
            <span>Add to ToDo List »</span>
          </li>
          <li className={classnames(styles.Action, { [styles.enabled]: !thread.threadUnread })}>
            <span className={styles.Actions__image}>
              <img src={flagIcon} />
            </span>
            <span>Mark as Read »</span>
          </li>
          <li className={classnames(styles.Action, { [styles.enabled]: !thread.senderUnread })}>
            <span className={styles.Actions__image}>
              <img src={doubleFlagIcon} />
            </span>
            <span>Mark All Emails From Sender as Read »</span>
          </li>
        </ul>
      </Sidebar>
      <Main>
        <h2 className={styles.Subject}>{message.subject}</h2>
        <List> 
          {prevMessages.map((message) => (
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
          <div
            dangerouslySetInnerHTML={{
              __html: message.body
            }}
          />
          {message.hasAttachments && <div className={styles.AttachmentWrapper}>
          {message.files.map((file) => (
            <a href={`/api/files/${file.id}`} className={styles.Attachment}>
              {file.filename}
            </a>
          ))}
          </div>}
        </div>
        <List divideTop={true}>
          {nextMessages.map((message) => (
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
