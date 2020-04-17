import Link from "next/link";
import PropTypes from "prop-types";
import classnames from "classnames";
import styles from "./Button.module.css";

export default function Button({
  href,
  as: asHref,
  children,
  variant = "primary",
  className = "",
  ...props
}) {
  const classes = classnames(styles.Button, styles[variant], className);
  if (href) {
    return (
      <Link href={href} as={asHref}>
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
  href: PropTypes.string,
  as: PropTypes.string,
  variant: PropTypes.oneOf(["primary", "secondary"]),
  children: PropTypes.node.isRequired
};
