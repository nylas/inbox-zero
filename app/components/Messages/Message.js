import { Fragment } from "react";
import PropTypes from "prop-types";
import Link from "next/link";
import classnames from "classnames";
import styles from "./Messages.module.css";
import attachment from "../../assets/attachment.svg";
import formatDate from "../../utils/formatDate";
import Frame from "./Frame";
import Attachment from "../Attachment";

function Message({
  id,
  fromName,
  fromEmailAddress,
  date,
  body,
  hasAttachments = false,
  files,
  // Injected by parent
  isOpen = false,
  onClick
}) {
  return (
    <Fragment>
      <a
        className={classnames(
          styles.Message,
          styles[isOpen ? "isOpen" : "isClosed"]
        )}
        onClick={onClick}
      >
        <span className={classnames(styles.Message__iconCell)}>
          <span className={styles.Message__icon}>
            {fromName && fromName.charAt(0).toUpperCase()}
          </span>
        </span>
        <span className={classnames(styles.Message__fromName)}>{fromName}</span>
        <span className={classnames(styles.Message__fromEmailAddress)}>
          {fromEmailAddress}
          {hasAttachments && (
            <img
              className={styles.Message__hasAttachments}
              src={attachment}
              alt="email has an attachment"
            />
          )}
        </span>
        <span className={classnames(styles.Message__date)}>
          {formatDate(new Date(date))}
        </span>
      </a>
      {isOpen && (
        <div className={styles.MessageContents}>
          <Frame content={body} />
          {hasAttachments && (
            <div className={styles.AttachmentWrapper}>
              {files.map(file => (
                <Attachment key={file.id} {...file} />
              ))}
            </div>
          )}
        </div>
      )}
    </Fragment>
  );
}

Message.propTypes = {
  id: PropTypes.string.isRequired,
  fromName: PropTypes.string.isRequired,
  fromEmailAddress: PropTypes.string.isRequired,
  date: PropTypes.string.isRequired,
  body: PropTypes.string.isRequired,
  hasAttachments: PropTypes.bool,
  files: PropTypes.array
};

export default Message;
