import PropTypes from "prop-types";
import classnames from "classnames";
import styles from "./MessageList.module.css";
import attachment from "../../assets/attachment.svg";

function Message({
  status,
  fromName,
  subject,
  preview,
  date,
  hasAttachment = false
}) {
  return (
    <tr className={classnames(styles.Message, styles[status])}>
      <td className={styles.Message__cell}>
        <div className={styles.Message__icon}>{fromName.charAt(0)}</div>
      </td>
      <td
        className={classnames(styles.Message__fromName, styles.Message__cell)}
      >
        {fromName}
      </td>
      <td className={classnames(styles.Message__subject, styles.Message__cell)}>
        {subject}
        {hasAttachment && (
          <img
            className={styles.Message__hasAttachment}
            src={attachment}
            alt="email has an attachment"
          />
        )}
      </td>
      <td className={classnames(styles.Message__preview, styles.Message__cell)}>
        {preview}
      </td>
      <td className={classnames(styles.Message__date, styles.Message__cell)}>
        {formatDate(new Date(date))}
      </td>
    </tr>
  );
}

Message.propTypes = {
  status: PropTypes.oneOf(["read", "unread"]).isRequired,
  fromName: PropTypes.string.isRequired,
  subject: PropTypes.string.isRequired,
  preview: PropTypes.string.isRequired,
  date: PropTypes.number.isRequired,
  hasAttachment: PropTypes.bool
};

function formatDate(date) {
  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec"
  ];

  return `${monthNames[date.getMonth()]} ${date.getDate()}`;
}

export default Message;
