import { useState, useRef, useEffect } from "react";

export default ({ content }) => {
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

    // force all links to open in a new tab
    [...doc.links].forEach(link => {
      link.target = "_blank";
      link.rel = "noopener noreferrer";
    });

    setIframeHeight(doc.documentElement.scrollHeight);

    // refresh height after each image loads
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
};
