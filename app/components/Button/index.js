import Link from "next/link";
import PropTypes from "prop-types";
import classnames from "classnames";
import styles from "./Button.module.css";

export default function Button({
  href,
  as,
  variant = "primary",
  children,
  className = "",
  ...props
}) {
  const classes = classnames(styles.Button, styles[variant], className);
  if (href) {
    return (
      <Link href={href} as={as}>
        <a className={classes}>{children}</a>
      </Link>
    );
  }

  return (
    <button className={classes} {...props}>
      {children}
    </button>
  );
}

Button.propTypes = {
  children: PropTypes.node.isRequired,
  variant: PropTypes.oneOf(["primary", "secondary"])
};
