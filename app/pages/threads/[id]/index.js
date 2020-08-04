import { Fragment, useReducer, useState, useRef, useEffect } from "react";
import NextError from "next/error";
import Head from "next/head";
import Router from "next/router";
import classnames from "classnames";
import NProgress from "nprogress";
import styles from "./id.module.css";
import Layout, { Header, Content, Sidebar } from "../../../layouts/Inbox";
import Input from "../../../components/Input";
import Button from "../../../components/Button";
import Messages, { Message } from "../../../components/Messages";
import Pagination from "../../../components/Pagination";
import Editor from "../../../components/Editor";
import BackButton from "../../../components/BackButton";
import Actions from "../../../components/Actions";
import AttachmentsAction from "../../../components/threadActions/AttachmentsAction";
import request from "../../../utils/request";
import withAuth from "../../../utils/withAuth";

export const getServerSideProps = withAuth(async context => {
  try {
    const thread = await request(`/threads/${context.query.id}`, { context });

    return {
      props: {
        account: context.account,
        serverThread: thread
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

  const [thread, threadDispatch] = useReducer(threadReducer, serverThread);
  const [reply, replyDispatch] = useReducer(
    replyReducer,
    generateReplyState({ thread: serverThread, account })
  );

  const showReply = () => {
    NProgress.start();
    replyDispatch({ type: "show" });
    NProgress.done();
  };

  const hideReply = () => {
    NProgress.start();
    replyDispatch({ type: "hide" });
    NProgress.done();
  };

  useEffect(() => {
    threadDispatch({ type: "reset", thread: serverThread });
    replyDispatch({
      type: "reset",
      reply: generateReplyState({ thread: serverThread, account })
    });
  }, [serverThread]);

  async function sendReply(event) {
    event.preventDefault();
    replyDispatch({ type: "submitting" });

    const fields = reply.fields;
    const toEmails = inputToEmails(fields.to);
    const ccEmails = inputToEmails(fields.cc);
    const bccEmails = inputToEmails(fields.bcc);
    const allEmails = [...toEmails, ...ccEmails, ...bccEmails];

    const invalidEmail = allEmails.find(({ email }) => !email.includes("@"));
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
          body: fields.body,
          files: fields.files
        }
      });

      Router.push("/");
    } catch (error) {
      /**
       * We only mark the form as completed if it fails.
       * If it succeeds, we keep it locked so there is no chance
       * the user sends two messages instead of one.
       */
      NProgress.done();
      replyDispatch({ type: "completed" });
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
        {reply.isVisible && (
          <Fragment>
            <BackButton onClick={() => hideReply()} />
            <Button onClick={sendReply} disabled={reply.isSubmitting}>
              Send
            </Button>
            <Actions>
              <AttachmentsAction
                files={reply.fields.files}
                onUpload={file => {
                  replyDispatch({ type: "uploadFile", file });
                }}
                onDelete={file => {
                  replyDispatch({ type: "deleteFile", file });
                }}
              />
            </Actions>
          </Fragment>
        )}
        {!reply.isVisible && (
          <Fragment>
            <BackButton />
            <Button onClick={() => showReply()}>Reply</Button>
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
        {reply.isVisible && (
          <ReplyForm fields={reply.fields} dispatch={replyDispatch} />
        )}
        <Messages divideTop={reply.isVisible}>
          {thread.messages.map(message => (
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
        {!reply.isVisible && (
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
        )}
      </Content>
    </Layout>
  );
}

function threadReducer(state, action) {
  switch (action.type) {
    case "addLabel":
      return {
        ...state,
        labels: state.labels.map(label =>
          label.id === action.label.id ? { ...label, checked: true } : label
        )
      };
    case "removeLabel":
      return {
        ...state,
        labels: state.labels.map(label =>
          label.id === action.label.id ? { ...label, checked: false } : label
        )
      };
    case "createLabel":
      return {
        ...state,
        labels: [...state.labels, action.label]
      };
    case "markRead":
      return { ...state, unread: false };
    case "markSenderRead":
      return { ...state, unread: false, senderUnread: false };
    case "reset":
      return action.thread;
    default:
      throw new Error();
  }
}

function replyReducer(state, action) {
  switch (action.type) {
    case "show":
      return {
        ...state,
        isVisible: true
      };
    case "hide":
      return {
        ...state,
        isVisible: false
      };
    case "submitting":
      return {
        ...state,
        isSubmitting: true
      };
    case "completed":
      return {
        ...state,
        isSubmitting: false
      };
    case "field":
      return {
        ...state,
        fields: {
          ...state.fields,
          [action.field]: action.value
        }
      };
    case "deleteFile":
      return {
        ...state,
        fields: {
          ...state.fields,
          files: state.fields.files.filter(file => file.id !== action.file.id)
        }
      };
    case "uploadFile":
      return {
        ...state,
        fields: {
          ...state.fields,
          files: [...state.fields.files, action.file]
        }
      };
    case "reset":
      return action.reply;
    default:
      throw new Error();
  }
}

function generateReplyState({ thread, account }) {
  const lastSentMessage = thread.messages[0];

  const participantsToEmails = participants =>
    participants
      .map(p => p.email)
      .filter(email => email !== account.emailAddress)
      .join(",");

  return {
    isSubmitting: false,
    isVisible: false,
    fields: {
      to: participantsToEmails([
        ...lastSentMessage.to,
        ...lastSentMessage.from
      ]),
      cc: participantsToEmails(lastSentMessage.cc),
      bcc: participantsToEmails(lastSentMessage.bcc),
      body: "",
      files: []
    }
  };
}

function inputToEmails(input) {
  if (!input) {
    return [];
  }

  return input.split(",").map(email => {
    return {
      email: email.trim().toLowerCase()
    };
  });
}

function ReplyForm({ fields, dispatch }) {
  const [showSecondaryEmails, setShowSecondaryEmails] = useState(
    fields.cc.length > 0 || fields.bcc.length > 0
  );

  const onChange = ({ target }) => {
    dispatch({ type: "field", field: target.name, value: target.value });
  };

  return (
    <Fragment>
      <div className={styles.Recipients}>
        <Input
          value={fields.to}
          placeholder="To"
          name="to"
          onChange={onChange}
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
        {showSecondaryEmails && (
          <Fragment>
            <Input
              value={fields.cc}
              placeholder="Cc"
              name="cc"
              onChange={onChange}
            />
            <Input
              value={fields.bcc}
              placeholder="Bcc"
              name="bcc"
              onChange={onChange}
            />
          </Fragment>
        )}
      </div>
      <div style={{ padding: "0 24px" }}>
        <Editor
          value={fields.body}
          onChange={value => {
            dispatch({ type: "field", field: "body", value });
          }}
        />
      </div>
    </Fragment>
  );
}
