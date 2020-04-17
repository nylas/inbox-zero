import PropTypes from "prop-types";
import styles from "./Actions.module.css";
import Action from "./Action";
import Slot from "./Slot";

function Actions({ children }) {
  return <ul className={styles.Actions}>{children}</ul>;
}

Actions.propTypes = {
  children: PropTypes.arrayOf(
    PropTypes.oneOfType([
      PropTypes.instanceOf(Action),
      PropTypes.instanceOf(Slot),
      PropTypes.bool
    ])
  ).isRequired
};

export default Actions;

export { Action, Slot };
