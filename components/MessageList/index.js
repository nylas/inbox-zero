import PropTypes from "prop-types";
import styles from "./MessageList.module.css";
import Message from "./Message";

function MessageList({ children }) {
  return (
    <table className={styles.MessageList}>
      <tbody>{children}</tbody>
    </table>
  );
}

MessageList.propTypes = {
  children: PropTypes.arrayOf(Message).isRequired
};

MessageList.Message = Message;

export default MessageList;
