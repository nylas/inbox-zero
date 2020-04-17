import { Fragment } from "react";
import Link from "next/link";
import PropTypes from "prop-types";
import classnames from "classnames";
import styles from "./Messages.module.css";
import attachment from "../../assets/attachment.svg";
import formatDate from "../../utils/formatDate";
import MessageFrame from "../MessageFrame";
import Attachment from "../Attachment";

function Message({
  id,
  fromName,
  fromEmailAddress,
  date,
  body,
  hasAttachments = false,
  files,
  // added by parent
  isOpen = false,
  handleClick
}) {
  return (
    <Fragment>
      <a
        className={classnames(
          styles.Message,
          styles[isOpen ? "isOpen" : "isClosed"]
        )}
        onClick={handleClick}
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
      {isOpen ? (
        <div className={styles.MessageContents}>
          <MessageFrame content={body} />
          {hasAttachments && (
            <div className={styles.AttachmentWrapper}>
              {files.map(file => (
                <Attachment {...file} />
              ))}
            </div>
          )}
        </div>
      ) : (
        ""
      )}
    </Fragment>
  );
}

Message.propTypes = {
  id: PropTypes.string.isRequired,
  fromName: PropTypes.string.isRequired,
  fromEmailAddress: PropTypes.string.isRequired,
  date: PropTypes.string.isRequired,
  hasAttachments: PropTypes.bool
};

export default Message;
