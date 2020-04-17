import PropTypes from "prop-types";
import styles from "./Threads.module.css";
import Thread from "./Thread";

function Threads({ children }) {
  return <div className={styles.Threads}>{children}</div>;
}

Threads.propTypes = {
  children: PropTypes.arrayOf(Thread).isRequired
};

export default Threads;
export { Thread };
