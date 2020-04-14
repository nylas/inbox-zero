import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import styles from "./MessageAccordion.module.css";
import Message from "./Message";
import classnames from "classnames";

function MessageAccordion({ children }) {
  const [index, setIndex] = useState(children.length - 1);

  useEffect(() => {
    setIndex(children.length - 1);
  }, [children]);

  return (
    <div className={styles.MessageAccordion}>
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

MessageAccordion.propTypes = {
  divideTop: PropTypes.bool,
  children: PropTypes.arrayOf(Message).isRequired
};

MessageAccordion.Message = Message;

export default MessageAccordion;
