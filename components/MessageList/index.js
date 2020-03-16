import PropTypes from "prop-types";
import styles from "./MessageList.module.css";
import Message from "./Message";
import classnames from "classnames";

function MessageList({ children, divideTop = false }) {
  return (
    <div
      className={classnames(styles.MessageList, {
        [styles.divideTop]: divideTop
      })}
    >
      {children}
    </div>
  );
}

MessageList.propTypes = {
  divideTop: PropTypes.bool,
  children: PropTypes.arrayOf(Message).isRequired
};

MessageList.Message = Message;

export default MessageList;
