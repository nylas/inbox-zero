import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import styles from "./Messages.module.css";
import Message from "./Message";
import classnames from "classnames";

/**
 * Accordion-like list for displaying all the messages in a thread
 */
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
      {/** Map children with additional properties: isOpen and onClick */
      React.Children.map(children, (child, i) =>
        React.cloneElement(child, {
          ...child.props,
          isOpen: i === index,
          onClick: () => {
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
