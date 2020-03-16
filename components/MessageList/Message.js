import Link from "next/link";
import PropTypes from "prop-types";
import classnames from "classnames";
import styles from "./MessageList.module.css";
import attachment from "../../assets/attachment.svg";
import formatDate from "../../utils/formatDate";

function Message({
  id,
  active,
  fromName,
  fromEmailAddress,
  date,
  hasAttachments = false
}) {
  return (
    <Link href="/messages/[id]" as={`/messages/${id}`}>
      <a
        className={classnames(
          styles.Message,
          styles[active ? "active" : "inactive"]
        )}
      >
        <span className={classnames(styles.Message__iconCell)}>
          <span className={styles.Message__icon}>
            {fromName.charAt(0).toUpperCase()}
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
    </Link>
  );
}

Message.propTypes = {
  id: PropTypes.string.isRequired,
  active: PropTypes.bool.isRequired,
  fromName: PropTypes.string.isRequired,
  fromEmailAddress: PropTypes.string.isRequired,
  date: PropTypes.string.isRequired,
  hasAttachments: PropTypes.bool
};

export default Message;
