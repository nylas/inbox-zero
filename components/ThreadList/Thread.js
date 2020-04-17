import Link from "next/link";
import PropTypes from "prop-types";
import classnames from "classnames";
import styles from "./ThreadList.module.css";
import attachment from "../../assets/attachment.svg";
import formatDate from "../../utils/formatDate";

function Thread({
  id,
  unread,
  fromName,
  subject,
  snippet,
  date,
  hasAttachment = false
}) {
  return (
    <Link href="/threads/[id]" as={`/threads/${id}`}>
      <a
        className={classnames(
          styles.Thread,
          styles[unread ? "unread" : "read"]
        )}
      >
        <span className={classnames(styles.Thread__iconCell)}>
          <span className={styles.Thread__icon}>
            {fromName && fromName.charAt(0).toUpperCase()}
          </span>
        </span>
        <span className={classnames(styles.Thread__fromName)}>{fromName}</span>
        <span className={classnames(styles.Thread__subjectAndAttachment)}>
          <span className={styles.Thread__subject}>{subject}</span>
          {hasAttachment && (
            <img
              className={styles.Thread__hasAttachment}
              src={attachment}
              alt="email has an attachment"
            />
          )}
        </span>
        <span
          className={classnames(styles.Thread__snippet)}
          dangerouslySetInnerHTML={{ __html: snippet }}
        />
        <span className={classnames(styles.Thread__date)}>
          {formatDate(new Date(date))}
        </span>
      </a>
    </Link>
  );
}

Thread.propTypes = {
  id: PropTypes.string.isRequired,
  unread: PropTypes.bool.isRequired,
  fromName: PropTypes.string.isRequired,
  subject: PropTypes.string.isRequired,
  snippet: PropTypes.string.isRequired,
  date: PropTypes.string.isRequired,
  hasAttachment: PropTypes.bool
};

export default Thread;
