import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import styles from "./Messages.module.css";
import Message from "./Message";
import classnames from "classnames";

function Messages({ children, divideTop }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    setIndex(0);
  }, [children]);

  return (
    <div
      className={classnames(styles.Messages, {
        [styles.divideTop]: divideTop
      })}
    >
      {React.Children.map(children, (child, i) =>
        React.cloneElement(child, {
          ...child.props,
          isOpen: i === index,
          handleClick: () => {
            setIndex(i);
          }
        })
      )}
    </div>
  );
}

Messages.propTypes = {
  divideTop: PropTypes.bool,
  children: PropTypes.arrayOf(Message).isRequired
};

export default Messages;
export { Message };
