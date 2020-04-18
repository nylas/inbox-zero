import PropTypes from "prop-types";
import styles from "./Actions.module.css";

function Action({ disabled, icon, onClick, onClickIcon = null, children }) {
  return (
    <li className={styles.Action}>
      <button
        className={styles.Action__button}
        onClick={onClick}
        disabled={disabled}
      >
        <span className={styles.Action__icon} onClick={onClickIcon}>
          <img src={icon} />
        </span>
        <span>{children}</span>
      </button>
    </li>
  );
}

Action.propTypes = {
  disabled: PropTypes.bool,
  icon: PropTypes.string.isRequired,
  onClick: PropTypes.func,
  onClickIcon: PropTypes.func
};

export default Action;
