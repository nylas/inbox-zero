import { Fragment, useState, useRef, useEffect } from "react";
import client from "../../../utils/client";
import Head from "next/head";
import Router from "next/router";
import Link from "next/link";
import Layout, { Header, Content, Sidebar } from "../../../layouts/Inbox";
import Input from "../../../components/Input";
import Button from "../../../components/Button";
import Accordion from "../../../components/MessageAccordion";
import styles from "./id.module.css";
import calendarIcon from "../../../assets/calendar.svg";
import checkIcon from "../../../assets/check.svg";
import flagIcon from "../../../assets/flag.svg";
import removeIcon from "../../../assets/remove.svg";
import doubleFlagIcon from "../../../assets/double_flag.svg";
import chevronLeftIcon from "../../../assets/chevron_left.svg";
import chevronRightIcon from "../../../assets/chevron_right.svg";
import checkboxUncheckedIcon from "../../../assets/checkbox_unchecked.svg";
import checkboxCheckedIcon from "../../../assets/checkbox_checked.svg";
import addAttachmentIcon from "../../../assets/add_attachment.svg";
import addIcon from "../../../assets/add.svg";
import withAuth from "../../../utils/withAuth";
import classnames from "classnames";
import Attachment from "../../../components/Attachment";
import { useReferrer } from "../../../components/Referrer";
import dynamic from "next/dynamic";
import NProgress from "nprogress";

const ReactQuill = dynamic(import("react-quill"), {
  ssr: false,
  loading: () => <div />
});

const Editor = props => {
  return (
    <div className={styles.Editor}>
      <ReactQuill theme="snow" {...props} />
    </div>
  );
};

function Recipients(props) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(2, 1fr)",
        gridColumnGap: "24px",
        gridRowGap: "12px",
        padding: "0 24px"
      }}
      {...props}
    />
  );
}

function ReplySidebar() {
  const fileInputRef = useRef(null);
  const [files, setFiles] = useState([]);

  async function handleFileChange(event) {
    const formData = new FormData();
    formData.append("upload", event.target.files[0]);

    const response = await fetch("/api/files", {
      method: "POST",
      body: formData
    });

    const file = await response.json();
    setFiles([...files, file]);
    console.log(file);
  }

  async function deleteFile(id) {
    await client(`/files/${id}`, {
      method: "DELETE"
    });

    setFiles(files.filter(file => file.id !== id));
  }

  return (
    <Sidebar>
      <BackButton />
      <Button>Send</Button>
      <ActionList>
        <input
          type="file"
          ref={fileInputRef}
          style={{ display: "none" }}
          onChange={handleFileChange}
        />
        <Action
          icon={addAttachmentIcon}
          onClick={() => {
            fileInputRef.current.click();
          }}
        >
          Add Attachment »
        </Action>
        {files.map(file => {
          return (
            <Action
              icon={removeIcon}
              onClickIcon={() => {
                deleteFile(file.id);
              }}
            >
              <Attachment {...file} />
            </Action>
          );
        })}
      </ActionList>
    </Sidebar>
  );
}

function ReplyForm({ account, thread }) {
  const referrer = useReferrer();
  const isOutsideReferrer =
    referrer === null || new URL(referrer).origin !== window.location.origin;

  const [body, setBody] = useState("");
  const [toInput, setToInput] = useState(
    thread.participants
      .map(({ email }) => email)
      .filter(email => email !== account.emailAddress)
      .join(", ")
  );
  const [showSecondaryEmails, setShowSecondaryEmails] = useState(true);
  const [ccInput, setCcInput] = useState("");
  const [bccInput, setBccInput] = useState("");

  function cleanEmail(str) {
    return str.trim().toLowerCase();
  }

  async function handleSubmit(e) {
    e.preventDefault();

    await client(`/threads/${thread.id}`, {
      body: {
        to: toInput ? toInput.split(",").map(cleanEmail) : [],
        cc: ccInput ? ccInput.split(",").map(cleanEmail) : [],
        bcc: bccInput ? bccInput.split(",").map(cleanEmail) : [],
        body
      }
    });
  }

  return (
    <Fragment>
      <Recipients>
        <Input value={toInput} onChange={e => setToInput(e.target.value)} />
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
              value={ccInput}
              placeholder="Cc"
              onChange={e => setCcInput(e.target.value)}
            />
            <Input
              value={bccInput}
              placeholder="Bcc"
              onChange={e => setBccInput(e.target.value)}
            />
          </Fragment>
        ) : (
          ""
        )}
      </Recipients>
      <div style={{ padding: "0 24px" }}>
        <Editor value={body} onChange={setBody} />
      </div>
    </Fragment>
  );
}

function BackButton({ onClick }) {
  return (
    <button className={styles.BackButton} onClick={onClick}>
      <img
        src={chevronLeftIcon}
        alt="Back"
        className={styles.BackButton__icon}
      />{" "}
      <span>Back</span>
    </button>
  );
}

function Subject({ unread, children }) {
  return (
    <h2
      className={classnames(styles.Subject, {
        [styles.unread]: unread
      })}
    >
      {children}
    </h2>
  );
}

function ActionList({ children }) {
  return <ul className={styles.Actions}>{children}</ul>;
}

function Labels({ labels, addLabel, removeLabel, createLabel }) {
  const labelInputRef = useRef(null);
  const [labelInput, setLabelInput] = useState("");
  const [showCreateLabelForm, setShowCreateLabelForm] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    await createLabel(labelInput);
    setLabelInput("");
    setShowCreateLabelForm(false);
  }

  useEffect(() => {
    if (showCreateLabelForm) {
      labelInputRef.current.focus();
    }
  }, [showCreateLabelForm]);

  return (
    <ul className={styles.Labels}>
      {labels.map(label => (
        <li className={styles.Label}>
          <button
            className={styles.Label__button}
            onClick={() => {
              if (label.checked) {
                removeLabel(label);
              } else {
                addLabel(label);
              }
            }}
          >
            <span className={styles.Label__icon}>
              <img
                src={
                  label.checked ? checkboxCheckedIcon : checkboxUncheckedIcon
                }
              />
            </span>
            <span>{label.displayName}</span>
          </button>
        </li>
      ))}
      {showCreateLabelForm ? (
        <li className={styles.CreateLabelInputWrapper}>
          <span className={styles.Label__icon}>
            <img src={checkboxUncheckedIcon} />
          </span>
          <form onSubmit={handleSubmit}>
            <Input
              ref={labelInputRef}
              onChange={e => setLabelInput(e.target.value)}
            />
          </form>
        </li>
      ) : (
        ""
      )}
      <li>
        <button
          className={styles.CreateLabelButton}
          onClick={() => {
            setShowCreateLabelForm(!showCreateLabelForm);
          }}
        >
          <span className={styles.CreateLabelButton__icon}>
            <img src={addIcon} />
          </span>
          Create List
        </button>
      </li>
    </ul>
  );
}

function Action({ disabled, icon, onClick, onClickIcon = null, children }) {
  return (
    <li className={styles.Action}>
      <button
        className={styles.Action__button}
        onClick={onClick}
        disabled={disabled}
      >
        <span className={styles.Action__icon} onClick={onClickIcon}>
          <img src={icon} />
        </span>
        <span>{children}</span>
      </button>
    </li>
  );
}

function DetailsSidebar({ account, thread, setThread }) {
  const [showLabels, setShowLabels] = useState(false);
  const showToDoList = account.organizationUnit === "label";

  async function updateThread(update) {
    NProgress.start();
    try {
      const updatedThread = await client(`/threads/${thread.id}`, {
        method: "PUT",
        body: update
      });

      setThread(updatedThread);
    } catch (e) {
      console.log(e);
      alert("Something went wrong");
    }
    NProgress.done();
  }

  function addLabel(label) {
    updateThread({
      labels: [...thread.labels.filter(label => label.checked), label]
    });
  }

  function removeLabel(label) {
    updateThread({
      labels: thread.labels.filter(
        ({ id, checked }) => id !== label.id && checked
      )
    });
  }

  async function createLabel(displayName) {
    NProgress.start();
    try {
      const newLabel = await client("/labels", {
        body: { displayName }
      });

      setThread({
        ...thread,
        labels: [...thread.labels, newLabel]
      });
    } catch (e) {
      alert("Something went wrong");
    }
    NProgress.done();
  }

  const referrer = useReferrer();
  const isOutsideReferrer =
    referrer === null || new URL(referrer).origin !== window.location.origin;

  return (
    <Sidebar>
      <BackButton
        onClick={() => {
          if (isOutsideReferrer) {
            Router.push("/");
          } else {
            Router.back();
          }
        }}
      />
      <Button href={`/threads/[id]/reply`} as={`/threads/${thread.id}/reply`}>
        Reply
      </Button>
      <ActionList>
        <Action icon={calendarIcon} onClick={() => {}}>
          Schedule Meeting »
        </Action>
        {showToDoList ? (
          <Action icon={checkIcon} onClick={() => setShowLabels(!showLabels)}>
            Add to ToDo List »
          </Action>
        ) : (
          ""
        )}
        {showLabels ? (
          <li>
            <Labels
              labels={thread.labels}
              addLabel={addLabel}
              removeLabel={removeLabel}
              createLabel={createLabel}
            />
          </li>
        ) : (
          ""
        )}
        <Action
          icon={flagIcon}
          disabled={thread.unread === false}
          onClick={() => updateThread({ unread: false })}
        >
          Mark as Read »
        </Action>
        <Action
          icon={doubleFlagIcon}
          disabled={thread.senderUnread === false}
          onClick={() => updateThread({ senderUnread: false })}
        >
          Mark All Emails From Sender as Read »
        </Action>
      </ActionList>
    </Sidebar>
  );
}

export const getServerSideProps = withAuth(async context => {
  const [thread, messages] = await Promise.all([
    client(`/threads/${context.query.id}`, { context }),
    client(`/threads/${context.query.id}/messages`, { context })
  ]);

  return {
    props: {
      account: context.account,
      serverThread: thread,
      messages
    }
  };
});

export default function threadPage({ account, serverThread, messages }) {
  const [showReply, setShowReply] = useState(true);
  const [thread, setThread] = useState(serverThread);
  useEffect(() => {
    setThread(serverThread);
  }, [serverThread]);

  return (
    <Layout>
      <Head>
        <title>{thread.subject} - Inbox Zero</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <Header account={account} />
      {showReply ? (
        <ReplySidebar />
      ) : (
        <DetailsSidebar
          account={account}
          thread={thread}
          setThread={setThread}
        />
      )}
      <Content>
        <Subject unread={thread.unread}>{thread.subject}</Subject>
        {showReply && <ReplyForm account={account} thread={thread} />}
        <Accordion>
          {messages.map(message => (
            <Accordion.Message
              id={message.id}
              fromName={message.from[0].name}
              fromEmailAddress={message.from[0].email}
              date={message.date}
              hasAttachments={message.hasAttachments}
              files={message.files}
              body={message.body}
            />
          ))}
        </Accordion>
        <div className={styles.Pagination}>
          <button
            className={styles.Pagination__button}
            disabled={thread.previousThreadId === null}
            onClick={() =>
              Router.push(
                `/threads/[id]`,
                `/threads/${thread.previousThreadId}`
              )
            }
          >
            <img
              className={styles.Pagination__icon}
              src={chevronLeftIcon}
              alt="previous"
            />{" "}
            Previous
          </button>
          <button
            className={styles.Pagination__button}
            disabled={thread.nextThreadId === null}
            onClick={() =>
              Router.push(`/threads/[id]`, `/threads/${thread.nextThreadId}`)
            }
          >
            Next{" "}
            <img
              className={styles.Pagination__icon}
              src={chevronRightIcon}
              alt="next"
            />
          </button>
        </div>
      </Content>
    </Layout>
  );
}
