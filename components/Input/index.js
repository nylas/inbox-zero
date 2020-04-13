import React from "react";
import classnames from "classnames";
import styles from "./Input.module.css";

export default React.forwardRef(function Input(
  { className = "", ...props },
  ref
) {
  return (
    <input
      ref={ref}
      className={classnames(styles.Input, className)}
      {...props}
    />
  );
});
