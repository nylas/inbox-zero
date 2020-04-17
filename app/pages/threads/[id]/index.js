import NextError from "next/error";
import { Fragment, useState, useRef, useEffect } from "react";
import request from "../../../utils/request";
import Head from "next/head";
import Router from "next/router";
import Layout, { Header, Content, Sidebar } from "../../../layouts/Inbox";
import Input from "../../../components/Input";
import Button from "../../../components/Button";
import Messages, { Message } from "../../../components/Messages";
import styles from "./id.module.css";
import withAuth from "../../../utils/withAuth";
import classnames from "classnames";
import Pagination from "../../../components/Pagination";
import Editor from "../../../components/Editor";
import BackButton from "../../../components/BackButton";
import Actions from "../../../components/Actions";
import AttachmentsAction from "../../../components/threadActions/AttachmentsAction";
import SchedulerAction from "../../../components/threadActions/SchedulerAction";
import LabelsAction from "../../../components/threadActions/LabelsAction";
import MarkReadAction from "../../../components/threadActions/MarkReadAction";
import MarkSenderReadAction from "../../../components/threadActions/MarkSenderReadAction";
import { useReferrer } from "../../../components/Referrer";
import NProgress from "nprogress";

export const getServerSideProps = withAuth(async context => {
  try {
    const thread = await request(`/threads/${context.query.id}`, { context });
    const schedulerPages = await request(
      `https://schedule.api.nylas.com/manage/pages`,
      {
        headers: { Authorization: `Bearer ${context.account.accessToken}` }
      }
    );

    return {
      props: {
        account: context.account,
        serverThread: thread,
        schedulerPages
      }
    };
  } catch (e) {
    return { props: { errorCode: 404 } };
  }
});

export default function ThreadPage({
  errorCode,
  account,
  serverThread,
  schedulerPages
}) {
  if (errorCode) {
    return <NextError statusCode={errorCode} />;
  }

  const [showReply, setShowReply] = useState(false);
  const [thread, setThread] = useState(serverThread);
  const messages = thread.messages;
  useEffect(() => {
    setThread(serverThread);
  }, [serverThread]);

  const [formState, setFormState] = useState({
    body: "",
    to: [...messages[0].to, ...messages[0].from]
      .filter(({ email }) => email !== account.emailAddress)
      .map(({ email }) => email)
      .join(", "),
    cc: messages[0].cc
      .filter(({ email }) => email !== account.emailAddress)
      .map(({ email }) => email)
      .join(", "),
    bcc: messages[0].bcc
      .filter(({ email }) => email !== account.emailAddress)
      .map(({ email }) => email)
      .join(", "),
    files: []
  });

  async function triggerSubmit(e) {
    e.preventDefault();

    const toEmails = formState.to
      ? formState.to.split(",").map(cleanEmail)
      : [];
    const ccEmails = formState.cc
      ? formState.cc.split(",").map(cleanEmail)
      : [];
    const bccEmails = formState.bcc
      ? formState.bcc.split(",").map(cleanEmail)
      : [];
    const allEmails = [...toEmails, ...ccEmails, ...bccEmails];

    const invalidEmail = allEmails.find(email => !email.includes("@"));

    if (invalidEmail) {
      return alert(`${invalidEmail} is not a valid email.`);
    }

    if (allEmails.length === 0) {
      return alert(`Please specify at least one recipient.`);
    }

    NProgress.start();
    try {
      await request(`/threads/${thread.id}`, {
        body: {
          to: toEmails,
          cc: ccEmails,
          bcc: bccEmails,
          body: formState.body,
          files: formState.files
        }
      });

      Router.push("/");
    } catch (error) {
      NProgress.done();
      alert(error.error);
    }
  }

  return (
    <Layout>
      <Head>
        <title>{thread.subject} - Inbox Zero</title>
      </Head>
      <Header account={account} />
      <Sidebar>
        {showReply && (
          <Fragment>
            <BackButton
              onClick={() => {
                NProgress.start();
                setShowReply(false);
                NProgress.done();
              }}
            />
            <Button onClick={triggerSubmit}>Send</Button>
            <Actions>
              <AttachmentsAction
                files={formState.files}
                onUpload={file => {
                  setFormState({
                    ...formState,
                    files: [...formState.files, file]
                  });
                }}
                onDelete={({ id }) => {
                  setFormState({
                    ...formState,
                    files: formState.files.filter(file => file.id !== id)
                  });
                }}
              />
            </Actions>
          </Fragment>
        )}
        {!showReply && (
          <Fragment>
            <DetailsBackButton />
            <Button
              onClick={() => {
                NProgress.start();
                setShowReply(true);
                NProgress.done();
              }}
            >
              Reply
            </Button>
            <Actions>
              <SchedulerAction
                accessToken={account.accessToken}
                schedulerPages={schedulerPages}
                onSchedule={page => {
                  NProgress.start();
                  setShowReply(true);
                  NProgress.done();
                  setFormState({
                    ...formState,
                    body: `<a href="https://schedule.nylas.com/${page.slug}">${page.name}</a>`
                  });
                }}
              />
              <LabelsAction
                thread={thread}
                onAdd={newLabel => {
                  setThread({
                    ...thread,
                    labels: thread.labels.map(label => {
                      if (newLabel.id === label.id) {
                        return {
                          ...label,
                          checked: true
                        };
                      }

                      return label;
                    })
                  });
                }}
                onRemove={oldLabel => {
                  setThread({
                    ...thread,
                    labels: thread.labels.map(label => {
                      if (oldLabel.id === label.id) {
                        return {
                          ...label,
                          checked: false
                        };
                      }

                      return label;
                    })
                  });
                }}
                onCreate={label => {
                  setThread({
                    ...thread,
                    labels: [...thread.labels, label]
                  });
                }}
              />
              <MarkReadAction
                thread={thread}
                onChange={({ unread }) => {
                  setThread({ ...thread, unread });
                }}
              />
              <MarkSenderReadAction
                thread={thread}
                onChange={({ senderUnread }) => {
                  setThread({ ...thread, senderUnread });
                }}
              />
            </Actions>
          </Fragment>
        )}
      </Sidebar>
      <Content>
        <h2
          className={classnames(styles.Subject, {
            [styles.unread]: thread.unread
          })}
        >
          {thread.subject}
        </h2>
        {showReply && <ReplyForm state={formState} setState={setFormState} />}
        <Messages divideTop={showReply}>
          {messages.map(message => (
            <Message
              key={message.id}
              id={message.id}
              fromName={message.from[0].name}
              fromEmailAddress={message.from[0].email}
              date={message.date}
              hasAttachments={message.hasAttachments}
              files={message.files}
              body={message.body}
            />
          ))}
        </Messages>
        <Pagination
          previous={
            thread.previousThreadId
              ? {
                  href: `/threads/[id]`,
                  as: `/threads/${thread.previousThreadId}`
                }
              : null
          }
          next={
            thread.nextThreadId
              ? {
                  href: `/threads/[id]`,
                  as: `/threads/${thread.nextThreadId}`
                }
              : null
          }
          variant="cursor"
        />
      </Content>
    </Layout>
  );
}

function ReplyForm({ state, setState }) {
  const [showSecondaryEmails, setShowSecondaryEmails] = useState(
    state.cc.length > 0 || state.bcc.length > 0
  );

  return (
    <Fragment>
      <div className={styles.Recipients}>
        <Input
          value={state.to}
          placeholder="To"
          onChange={e =>
            setState({
              ...state,
              to: e.target.value
            })
          }
        />
        <div>
          <button
            className={styles.ShowSecondaryEmailsButton}
            onClick={() => {
              setShowSecondaryEmails(!showSecondaryEmails);
            }}
          >
            CC BCC
          </button>
        </div>
        {showSecondaryEmails ? (
          <Fragment>
            <Input
              value={state.cc}
              placeholder="Cc"
              onChange={e =>
                setState({
                  ...state,
                  cc: e.target.value
                })
              }
            />
            <Input
              value={state.bcc}
              placeholder="Bcc"
              onChange={e =>
                setState({
                  ...state,
                  bcc: e.target.value
                })
              }
            />
          </Fragment>
        ) : (
          ""
        )}
      </div>
      <div style={{ padding: "0 24px" }}>
        <Editor
          value={state.body}
          onChange={body => {
            setState({
              ...state,
              body
            });
          }}
        />
      </div>
    </Fragment>
  );
}

function DetailsBackButton() {
  const referrer = useReferrer();

  return (
    <BackButton
      onClick={() => {
        const isOutsideReferrer =
          referrer === null ||
          new URL(referrer).origin !== window.location.origin;

        const fromListPage =
          !isOutsideReferrer && new URL(referrer).pathname === "/";

        if (isOutsideReferrer || !fromListPage) {
          Router.push("/");
        } else {
          Router.back();
        }
      }}
    />
  );
}

function cleanEmail(str) {
  return str.trim().toLowerCase();
}
