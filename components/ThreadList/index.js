import PropTypes from "prop-types";
import styles from "./ThreadList.module.css";
import Thread from "./Thread";

function ThreadList({ children }) {
  return <div className={styles.ThreadList}>{children}</div>;
}

ThreadList.propTypes = {
  children: PropTypes.arrayOf(Thread).isRequired
};

ThreadList.Thread = Thread;

export default ThreadList;
