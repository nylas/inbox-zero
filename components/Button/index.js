import Link from "next/link";
import PropTypes from "prop-types";
import classnames from "classnames";
import styles from "./Button.module.css";

export default function Button({
  href,
  variant = "primary",
  children,
  className = ""
}) {
  const classes = classnames(styles.Button, styles[variant], className);
  if (href) {
    return (
      <Link href={href}>
        <a className={classes}>{children}</a>
      </Link>
    );
  }

  return <button className={classes}>{children}</button>;
}

Button.propTypes = {
  children: PropTypes.node.isRequired,
  variant: PropTypes.oneOf(["primary", "secondary"])
};
