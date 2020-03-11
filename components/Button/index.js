import PropTypes from "prop-types";
import classnames from "classnames";
import styles from "./Button.module.css";

export default function Button({
  variant = "primary",
  children,
  className = ""
}) {
  return (
    <button className={classnames(styles.Button, styles[variant], className)}>
      {children}
    </button>
  );
}

Button.propTypes = {
  children: PropTypes.node.isRequired,
  variant: PropTypes.oneOf(["primary", "secondary"])
};
