import { useState, useRef, useEffect } from "react";
import PropTypes from "prop-types";

/**
 * React component which safely diplays the content of an email
 *
 * How it works:
 * - when the component is first rendered it renders an iframe
 * - when React is ready to run side affects, we inject the
 *   content, our styling, and javascript
 * - the injected javascript will open all links in a new tab and
 *   when each image loads it will force the iframe to get resized
 *   so it properly contains the full email content
 */
function Frame({ content }) {
  const [iframeHeight, setIframeHeight] = useState(0);

  const ref = useRef(null);
  useEffect(() => {
    const doc = ref.current.contentWindow.document;
    doc.body.innerHTML = content;

    // add default styling
    const style = doc.createElement("style");
    style.innerHTML = `
      body {
        font-family: "Source Sans Pro", Roboto, RobotoDraft, Helvetica, Arial, sans-serif;
        overflow: hidden;
      }

      .gmail_quote {
        display: none;
      }
    `;
    doc.head.appendChild(style);

    // Set the initial height
    setIframeHeight(doc.documentElement.scrollHeight);

    // Force all links to open in a new tab
    [...doc.links].forEach(link => {
      link.target = "_blank";
      link.rel = "noopener noreferrer";
    });

    // Refresh height after each image loads
    [...doc.images].forEach(image => {
      image.onload = function() {
        setIframeHeight(doc.documentElement.scrollHeight);
      };
    });
  }, [content]);

  return (
    <iframe
      ref={ref}
      style={{
        width: "100%",
        border: 0,
        height: `${iframeHeight}px`,
        overflow: "hidden"
      }}
    />
  );
}

Frame.propTypes = {
  content: PropTypes.string.isRequired
};

export default Frame;
